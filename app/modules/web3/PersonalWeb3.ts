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

  isConnected(): Promise<boolean>;
}
