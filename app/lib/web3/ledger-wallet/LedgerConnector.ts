import { inject, injectable } from "inversify";
import * as Web3 from "web3";

import { EthereumNetworkId } from "../../../types";
import { IEthereumNetworkConfig } from "../types";
import { LedgerError, LedgerUnknownError, LedgerLockedError } from "./errors";
import { LedgerWallet } from "./LedgerWallet";
import { Web3Adapter } from "../Web3Adapter";
import { symbols } from "../../../di/symbols";
import { connectToLedger, testConnection } from "./ledgerUtils";
import { IDerivationPathToAddress } from "./types";

@injectable()
export class LedgerWalletConnector {
  private web3?: Web3;
  private ledgerInstance?: any;

  public constructor(
    @inject(symbols.ethereumNetworkConfig) public readonly web3Config: IEthereumNetworkConfig,
  ) {}

  public async connect(networkId: EthereumNetworkId): Promise<void> {
    try {
      const { ledgerWeb3, ledgerInstance } = await connectToLedger(
        networkId,
        this.web3Config.rpcUrl,
      );
      this.web3 = ledgerWeb3;
      this.ledgerInstance = ledgerInstance;
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
    const web3Adapter = new Web3Adapter(this.web3);

    // note: in future we may want to solve locking issue on a lower level
    const address = await web3Adapter.getAccountAddress();

    return new LedgerWallet(web3Adapter, address, this.ledgerInstance, derivationPath);
  }

  public async getMultipleAccounts(derivationPaths: string[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.ledgerInstance.getAccounts((err: Error | undefined, _accounts: string[]) => {
        if (!err) {
          return resolve(_accounts);
        } else {
          reject(new LedgerLockedError());
        }
      });
    });
  }

  public async getMultipleAccountsFromDerivationPrefix(): Promise<IDerivationPathToAddress> {
    return new Promise<IDerivationPathToAddress>((resolve, reject) => {
      return this.ledgerInstance.getAccounts((err: Error | undefined, _accounts: string[]) => {
        if (!err) {
          resolve();
        } else {
          reject(new LedgerLockedError());
        }
      });
    });
  }

  public async testConnection(): Promise<boolean> {
    return testConnection(this.ledgerInstance);
  }
}
