import { ITxMonitorState } from "./reducer";

export const selectAmountOfPendingTxs = (state: ITxMonitorState): number => {
  return state.txs.oooTransactions.length + (state.txs.pendingTransaction ? 1 : 0);
};
