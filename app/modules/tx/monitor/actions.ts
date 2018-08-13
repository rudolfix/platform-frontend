import { TxWithMetadata } from "../../../lib/api/users/interfaces";
import { createAction } from "../../actionsUtils";

export const txMonitorActions = {
  loadTxs: (txs: Array<TxWithMetadata>) => createAction("TX_MONITOR_LOAD_TXS", { txs }),
};
