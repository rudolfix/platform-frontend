import { EthereumAddress, EthereumNetworkId } from "../../types";
import { Web3Adapter } from "./Web3Adapter";

// normalized information about all possible types of personal wallets
export enum WalletType {
  LEDGER = "LEDGER",
  BROWSER = "BROWSER",
}
export enum WalletSubType {
  METAMASK = "METAMASK",
  PARITY = "PARITY",
  UNKNOWN = "UNKNOWN",
}

export interface IPersonalWallet {
  readonly web3Adapter: Web3Adapter;
  readonly ethereumAddress: EthereumAddress;
  readonly walletType: WalletType;
  readonly walletSubType: WalletSubType;

  // this will be periodically ran by Web3Manager to ensure that wallet connection is still established
  testConnection(networkId: EthereumNetworkId): Promise<boolean>;

  // sign message with the best available method for a given wallet
  signMessage(data: string): Promise<string>;
}
