import * as Web3 from "web3";
import { EthereumNetworkId } from "../../types";

export enum WalletType {
  LEDGER = "LEDGER",
  BROWSER = "BROWSER",
}

export enum BrowserWalletSubType {
  METAMASK = "METAMASK",
}

// idea: split this interface into PersonalWalletFactory and PersonalWallet
// this will allow for cleaner, immutable interface for PersonalWallet
export interface IPersonalWallet {
  type: WalletType;
  subType?: BrowserWalletSubType;

  web3?: Web3;

  // this will be periodically ran by Web3Manager to ensure that wallet connection is still established
  testConnection(networkId: EthereumNetworkId): Promise<boolean>;

  connect(networkId: string): Promise<void>;
}
