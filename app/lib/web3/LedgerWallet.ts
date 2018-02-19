import ledgerWalletProvider from "ledger-wallet-provider";
import * as semver from "semver";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

import { delay } from "bluebird";
import { inject, injectable } from "inversify";
import { symbols } from "../../di/symbols";
import { WalletSubType, WalletType } from "../../modules/web3/types";
import { EthereumAddress, EthereumNetworkId } from "../../types";
import { IPersonalWallet, SignerType } from "./PersonalWeb3";
import { Web3Adapter } from "./Web3Adapter";
import { IEthereumNetworkConfig, SignerError } from "./Web3Manager";

const CHECK_INTERVAL = 1000;

interface ILedgerConfig {
  version: string;
  arbitraryDataEnabled: boolean;
}

export interface IDerivationPathToAddress {
  [derivationPath: string]: string;
}

export class LedgerError extends Error {}
export class LedgerLockedError extends LedgerError {}
export class LedgerNotAvailableError extends LedgerError {}
export class LedgerNotSupportedVersionError extends LedgerError {}
export class LedgerInvalidDerivationPathError extends LedgerError {}
export class LedgerUnknownError extends LedgerError {}

export class LedgerWallet implements IPersonalWallet {
  public readonly walletType = WalletType.LEDGER;
  public readonly walletSubType = WalletSubType.UNKNOWN; // in future we may detect if it's pure ledger or Neukey
  public readonly signerType = SignerType.ETH_SIGN_TYPED_DATA;

  public constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly ethereumAddress: EthereumAddress,
    private readonly ledgerInstance: any | undefined,
  ) {}

  public async testConnection(): Promise<boolean> {
    return testConnection(this.ledgerInstance);
  }

  public async signMessage(data: string): Promise<string> {
    try {
      return noSimultaneousConnectionsGuard(this.ledgerInstance, async () => {
        return await this.web3Adapter.ethSign(this.ethereumAddress, data);
      });
    } catch {
      throw new SignerError();
    }
  }
}

@injectable()
export class LedgerWalletConnector {
  private web3?: Web3;
  private ledgerInstance?: any;

  public constructor(
    @inject(symbols.ethereumNetworkConfig) public readonly web3Config: IEthereumNetworkConfig,
  ) {}

  public async connect(networkId: EthereumNetworkId): Promise<void> {
    try {
      const ledger = await connectToLedger(networkId, this.web3Config.rpcUrl);
      this.web3 = ledger.ledgerWeb3;
      this.ledgerInstance = ledger.ledgerInstance;
    } catch (e) {
      if (e instanceof LedgerError) {
        throw e;
      } else {
        throw new LedgerUnknownError();
      }
    }
  }

  public async finishConnecting(derivationPath: string): Promise<LedgerWallet> {
    if (!this.web3) {
      throw new Error("Can't finish not started connection");
    }

    try {
      await noSimultaneousConnectionsGuard(this.ledgerInstance, () =>
        this.ledgerInstance.setDerivationPath(derivationPath),
      );
    } catch (e) {
      throw new LedgerInvalidDerivationPathError();
    }

    const web3Adapter = new Web3Adapter(this.web3);

    // note: in future we may want to solve locking issue on a lower level
    const address = await noSimultaneousConnectionsGuard(this.ledgerInstance, () =>
      web3Adapter.getAccountAddress(),
    );
    return new LedgerWallet(web3Adapter, address, this.ledgerInstance);
  }

  public async getMultipleAccounts(derivationPaths: string[]): Promise<IDerivationPathToAddress> {
    const accounts: IDerivationPathToAddress = {};

    for (const derivationPath of derivationPaths) {
      const account = await noSimultaneousConnectionsGuard(this.ledgerInstance, () => {
        return this.ledgerInstance.getMultipleAccounts(derivationPath, 0, 1);
      });
      Object.assign(accounts, account);
    }

    return accounts;
  }

  public async getMultipleAccountsFromDerivationPrefix(
    derivationPathPrefix: string,
    page: number,
    addressesPerPage: number,
  ): Promise<IDerivationPathToAddress> {
    const derivationPath = derivationPathPrefix + "0";

    return noSimultaneousConnectionsGuard(this.ledgerInstance, () => {
      return this.ledgerInstance.getMultipleAccounts(
        derivationPath,
        page * addressesPerPage,
        addressesPerPage,
      );
    });
  }

  public async testConnection(): Promise<boolean> {
    return testConnection(this.ledgerInstance);
  }
}

async function testConnection(ledgerInstance: any): Promise<boolean> {
  try {
    // this check will successfully detect if ledger is locked or disconnected
    await getLedgerConfig(ledgerInstance);
    return true;
  } catch {
    return false;
  }
}

async function testIfUnlocked(ledgerInstance: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ledgerInstance.getAccounts((err: Error | undefined, _accounts: string) => {
      if (!err) {
        resolve();
      } else {
        reject(new LedgerLockedError());
      }
    });
  });
}

async function getLedgerConfig(ledgerInstance: any): Promise<ILedgerConfig> {
  return new Promise<ILedgerConfig>(async (resolve, reject) => {
    noSimultaneousConnectionsGuard(ledgerInstance, () => {
      ledgerInstance.getAppConfig((error: any, data: ILedgerConfig) => {
        if (error) {
          if (error.message === "Timeout") {
            reject(new LedgerNotAvailableError());
          } else {
            reject(error);
          }
        } else {
          resolve(data);
        }
      }, CHECK_INTERVAL / 2);
    }).catch(reject);
  });
}

interface ILedgerOutput {
  ledgerInstance: any;
  ledgerWeb3: any;
}

async function createWeb3WithLedgerProvider(
  networkId: string,
  rpcUrl: string,
): Promise<ILedgerOutput> {
  const engine = new Web3ProviderEngine();
  const ledgerProvider = await ledgerWalletProvider(async () => networkId);

  const ledgerInstance = ledgerProvider.ledger;

  engine.addProvider(ledgerProvider);
  engine.addProvider(
    new RpcSubprovider({
      rpcUrl,
    }),
  );
  engine.start();

  return {
    ledgerInstance,
    ledgerWeb3: new Web3(engine),
  };
}

async function connectToLedger(networkId: string, rpcUrl: string): Promise<ILedgerOutput> {
  let providerEngine: any;
  try {
    const { ledgerInstance, ledgerWeb3 } = await createWeb3WithLedgerProvider(networkId, rpcUrl);
    providerEngine = ledgerWeb3.currentProvider;

    const ledgerConfig = await getLedgerConfig(ledgerInstance);
    if (semver.lt(ledgerConfig.version, "1.0.8")) {
      throw new LedgerNotSupportedVersionError(ledgerConfig.version);
    }

    await testIfUnlocked(ledgerInstance);

    return { ledgerInstance, ledgerWeb3 };
  } catch (e) {
    // we need to explicitly stop Web3 Provider engine
    if (providerEngine) {
      providerEngine.stop();
    }
    throw e;
  }
}

// right after callback needs to be used instead of awaiting for this function because promise resolving is async
async function noSimultaneousConnectionsGuard<T>(
  ledgerInstance: any,
  callRightAfter: () => T,
): Promise<T> {
  while (ledgerInstance.connectionOpened) {
    await delay(0);
  }
  return callRightAfter();
}
