import { ETxType } from "@neufund/shared-modules";
import { EthereumAddressWithChecksum } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

export interface ITxData {
  to: EthereumAddressWithChecksum;
  value: string;
  data?: string;
  from: EthereumAddressWithChecksum;
  input?: string;
  gas: string;
  gasPrice: string;
}

export interface ITxMetadata {
  transactionType: ETxType;
  transactionAdditionalData: object | undefined;
}

export interface IRawTxData extends ITxData {
  nonce: string;
}

export interface IEthereumNetworkConfig {
  rpcUrl: string;
  backendRpcUrl: string;
  bridgeUrl: string;
}

export enum ESignTransactionMethod {
  ETH_SEND_TRANSACTION = "eth_sendTransaction",
  ETH_SEND_TYPED_TRANSACTION = "eth_sendTypedTransaction",
}

export type TBigNumberVariants = string | BigNumber;
