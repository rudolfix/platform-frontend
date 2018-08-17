import { ITxMonitorState } from "./reducer";

export const selectAmountOfPendingTxs = (state: ITxMonitorState): number => {
  return state.txs.filter(
    t => t.transaction.status === "pending" || t.transaction.status === "unknown", //currently we treat unknown txs as pending
  ).length;
};

export const selectAmountOfMinedTxs = (state: ITxMonitorState): number => {
  return state.txs.filter(t => t.transaction.status === "mined").length;
};
