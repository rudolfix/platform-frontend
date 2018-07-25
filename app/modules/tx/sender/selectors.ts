import { ITxSenderState } from "./reducer";

export const selectTxSenderModalOpened = (state: ITxSenderState): boolean =>
  state.state !== "UNINITIALIZED";
