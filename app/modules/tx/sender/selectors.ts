import { ITxData } from "./../../../lib/web3/Web3Manager";
import { ITxSenderState, ETxSenderType } from "./reducer";

export const selectTxSenderModalOpened = (state: ITxSenderState): boolean =>
  state.state !== "UNINITIALIZED";

export const selectTxDetails = (state: ITxSenderState): ITxData | undefined => state.txDetails;

export const selectTxType = (state: ITxSenderState): ETxSenderType | undefined => state.type;
