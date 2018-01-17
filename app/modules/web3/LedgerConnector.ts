import ledgerWalletProvider from "ledger-wallet-provider";
import * as semver from "semver";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

import { inject, injectable } from "inversify";
import { IPersonalWallet, WalletType } from "./PersonalWeb3";
import { EthereumNetworkConfig, IEthereumNetworkConfig } from "./Web3Manager";

const CHECK_INTERVAL = 1000;

interface ILedgerConfig {
  version: string;
  arbitraryDataEnabled: boolean;
}

export interface IDerivationPathToAddress {
  [derivationPath: string]: string;
}

export class LedgerLockedError extends Error {}
export class LedgerNotAvailableError extends Error {}
export class LedgerNotSupportedVersionError extends Error {}
export class LedgerInvalidDerivationPathError extends Error {}

export const LedgerConnectorSymbol = "LedgerConnector";

@injectable()
export class LedgerConnector implements IPersonalWallet {
  public readonly type: WalletType.LEDGER;
  public web3: Web3;

  public constructor(
    @inject(EthereumNetworkConfig) public readonly web3Config: IEthereumNetworkConfig,
  ) {}

  public isConnected(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public async connect(networkId: string): Promise<void> {
    const ledger = await connectToLedger(networkId, this.web3Config.rpcUrl);
    this.web3 = ledger.ledgerWeb3;
  }

  public setDerivationPath(derivationPath: string): void {
    try {
      (this.web3 as any).setDerivationPath(derivationPath);
    } catch (e) {
      throw new LedgerInvalidDerivationPathError();
    }
  }

  public async getMultipleAccounts(
    derivationPath: string,
    startingIndex: number,
    numberOfAddresses: number,
  ): Promise<IDerivationPathToAddress> {
    return (this.web3 as any).getMultipleAccounts(derivationPath, startingIndex, numberOfAddresses);
  }
}

async function testIfUnlocked(ledgerInstance: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ledgerInstance.getAccounts((err: Error | undefined, accounts: string) => {
      if (!err) {
        resolve();
      } else {
        reject(new LedgerLockedError());
      }
    });
  });
}

async function getLedgerConfig(ledgerInstance: any): Promise<ILedgerConfig> {
  return new Promise<ILedgerConfig>((resolve, reject) => {
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
  const { ledgerInstance, ledgerWeb3 } = await createWeb3WithLedgerProvider(networkId, rpcUrl);

  const ledgerConfig = await getLedgerConfig(ledgerInstance);
  if (semver.lt(ledgerConfig.version, "1.0.8")) {
    throw new LedgerNotSupportedVersionError(ledgerConfig.version);
  }

  await testIfUnlocked(ledgerInstance);

  return { ledgerInstance, ledgerWeb3 };
}
