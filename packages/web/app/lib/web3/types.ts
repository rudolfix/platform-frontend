import BigNumber from "bignumber.js";

export interface ITxData {
  to: string;
  value: string;
  data?: string;
  from: string;
  input?: string;
  gas: string;
  gasPrice: string;
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
}

export type TBigNumberVariants = string | BigNumber;
