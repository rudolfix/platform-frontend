import { TxWithMetadata } from "../../../lib/api/users/interfaces";
import { AppReducer } from "../../../store";
import { DeepReadonly } from "../../../types";

export interface ITxMonitorState {
  txs: Array<TxWithMetadata>;
}

const initialState: ITxMonitorState = {
  txs: [],
};

export const txMonitorReducer: AppReducer<ITxMonitorState> = (
  state = initialState,
  action,
): DeepReadonly<ITxMonitorState> => {
  switch (action.type) {
    case "TX_MONITOR_LOAD_TXS":
      return {
        txs: action.payload.txs,
      };
  }

  return state;
};
