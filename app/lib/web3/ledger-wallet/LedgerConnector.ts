import Eth from "@ledgerhq/hw-app-eth";
import { inject, injectable } from "inversify";
import * as Web3 from "web3";

import { symbols } from "../../../di/symbols";
import { EthereumNetworkId } from "../../../types";
import { IEthereumNetworkConfig } from "../types";
import { Web3Adapter } from "../Web3Adapter";
import { LedgerError, LedgerUnknownError } from "./errors";
import {
  connectToLedger,
  obtainPathComponentsFromDerivationPath,
  testConnection,
} from "./ledgerUtils";
import { LedgerWallet } from "./LedgerWallet";
import { IDerivationPathToAddress, ILedgerCustomProvider } from "./types";

@injectable()
export class LedgerWalletConnector {
  private web3?: Web3;
  private ledgerInstance?: ILedgerCustomProvider;

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

  public async getMultipleAccountsFromHdPath(
    derivationPaths: string,
    indexOffset: number = 1,
    accountsNo: number = 0,
  ): Promise<any> {
    if (!this.ledgerInstance) throw new Error();
    {
      const Transport = await this.ledgerInstance.getTransport();
      try {
        const pathComponents = obtainPathComponentsFromDerivationPath(derivationPaths);

        const chainCode = false; // Include the chain code
        const ethInstance = new Eth(Transport);

        const addresses: { [index: string]: string } = {};
        for (let i = indexOffset; i < indexOffset + accountsNo; i += 1) {
          const path = pathComponents.basePath + (pathComponents.index + i).toString();
          const address = await ethInstance.getAddress(path, false, chainCode);
          addresses[path] = address.address;
        }
        return addresses;
      } finally {
        Transport.close();
      }
    }
  }

  public async getMultipleAccounts(derivationPaths: string[]): Promise<IDerivationPathToAddress> {
    const accounts: IDerivationPathToAddress = {};

    for (const derivationPath of derivationPaths) {
      if (!this.ledgerInstance) throw new Error();

      const account = await this.getMultipleAccountsFromHdPath(derivationPath, 0, 1);
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

    return this.getMultipleAccountsFromHdPath(
      derivationPath,
      page * addressesPerPage,
      addressesPerPage,
    );
  }
  public async testConnection(): Promise<boolean> {
    if (!this.ledgerInstance) throw new Error();

    return testConnection(this.ledgerInstance);
  }
}
