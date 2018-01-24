import * as Web3 from "web3";

export enum WalletType {
  LEDGER = "LEDGER",
  BROWSER = "BROWSER",
}

export enum BrowserWalletSubType {
  METAMASK = "METAMASK",
}

export interface IPersonalWallet {
  type: WalletType;
  subType?: BrowserWalletSubType;

  web3?: Web3;

  // this will be periodically ran by Web3Manager to ensure that wallet connection is still established
  testConnection(networkId: string): Promise<boolean>;
}
