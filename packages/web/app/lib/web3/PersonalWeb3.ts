import { EthereumAddressWithChecksum, EthereumNetworkId } from "@neufund/shared";
import { ESignerType } from "@neufund/shared-modules";
import { TxData } from "web3";

import { TWalletMetadata } from "../../modules/web3/types";
import { Web3Adapter } from "./Web3Adapter";

export interface IPersonalWallet {
  readonly web3Adapter: Web3Adapter;
  readonly ethereumAddress: EthereumAddressWithChecksum;

  // returns type of a signer based on walletType and walletSubType
  getSignerType(): ESignerType;

  // this will be periodically ran by Web3Manager to ensure that wallet connection is still established
  testConnection(networkId: EthereumNetworkId): Promise<boolean>;

  // sign message with the best available method for a given wallet
  signMessage(data: string): Promise<string>;

  sendTransaction(txData: TxData): Promise<string>;

  getMetadata(): TWalletMetadata;

  isUnlocked(): boolean;
}
