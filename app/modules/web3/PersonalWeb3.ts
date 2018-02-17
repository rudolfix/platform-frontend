import { EthereumAddress, EthereumNetworkId } from "../../types";
import { WalletSubType, WalletType } from "./types";
import { Web3Adapter } from "./Web3Adapter";

// strings should match signer types on backend
export enum SignerType {
  ETH_SIGN = "eth_sign",
  ETH_SIGN_TYPED_DATA = "eth_signTypedData",
}

export interface IPersonalWallet {
  readonly web3Adapter: Web3Adapter;
  readonly ethereumAddress: EthereumAddress;
  readonly walletType: WalletType;
  readonly walletSubType: WalletSubType;
  readonly signerType: SignerType;

  // this will be periodically ran by Web3Manager to ensure that wallet connection is still established
  testConnection(networkId: EthereumNetworkId): Promise<boolean>;

  // sign message with the best available method for a given wallet
  signMessage(data: string): Promise<string>;
}
