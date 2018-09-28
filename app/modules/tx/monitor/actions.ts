import { TPendingTxs } from "../../../lib/api/users/interfaces";
import { createAction } from "../../actionsUtils";

export const txMonitorActions = {
  loadTxs: (txs: TPendingTxs) => createAction("TX_MONITOR_LOAD_TXS", { txs }),
};
