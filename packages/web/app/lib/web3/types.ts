import BigNumber from "bignumber.js";

export interface IGasValidationData {
  value: string;
  gas: string;
  gasPrice: string;
}

export type ITxData = IGasValidationData & {
  to: string;
  data?: string;
  from: string;
  input?: string;
}

export interface IRawTxData extends ITxData {
  nonce: string;
}

export interface IEthereumNetworkConfig {
  rpcUrl: string;
  backendRpcUrl: string;
}

export type TBigNumberVariants = string | BigNumber;
