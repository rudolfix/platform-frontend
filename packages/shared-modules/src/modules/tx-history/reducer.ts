import { AppReducer } from "@neufund/sagas";
import { DeepReadonly, Dictionary } from "@neufund/shared-utils";

import { txHistoryActions } from "./actions";
import { TTxHistory } from "./types";

export enum EModuleStatus {
  LOADING = "loading",
  IDLE = "idle",
}

export interface ITxHistoryState {
  transactionsByHash: Dictionary<TTxHistory> | undefined;
  transactionsOrder: string[] | undefined;
  // Used to load check whether we have more transactions to load
  timestampOfLastChange: number | undefined;
  lastTransactionId: string | undefined;
  status: EModuleStatus;
}

const initialState: ITxHistoryState = {
  transactionsByHash: undefined,
  transactionsOrder: undefined,
  lastTransactionId: undefined,
  timestampOfLastChange: undefined,
  status: EModuleStatus.IDLE,
};

const txHistoryReducer: AppReducer<ITxHistoryState, typeof txHistoryActions> = (
  state = initialState,
  action,
): DeepReadonly<ITxHistoryState> => {
  switch (action.type) {
    case txHistoryActions.loadTransactions.getType():
    case txHistoryActions.loadNextTransactions.getType():
      return {
        ...state,
        status: EModuleStatus.LOADING,
      };
    case txHistoryActions.setModuleStatus.getType():
      return {
        ...state,
        status: action.payload.status,
      };
    case txHistoryActions.setTransactions.getType(): {
      return action.payload;
    }
  }

  return state;
};

const txHistoryReducerMap = {
  txHistory: txHistoryReducer,
};

export { txHistoryReducerMap, initialState };
