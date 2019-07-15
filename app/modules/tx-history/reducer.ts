import { keyBy } from "lodash";

import { AppReducer } from "../../store";
import { DeepReadonly, Dictionary } from "../../types";
import { actions } from "../actions";
import { TTxHistory } from "./types";

export enum EModuleStatus {
  LOADING,
  IDLE,
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

export const txHistoryReducer: AppReducer<ITxHistoryState> = (
  state = initialState,
  action,
): DeepReadonly<ITxHistoryState> => {
  switch (action.type) {
    case actions.txHistory.loadTransactions.getType():
    case actions.txHistory.loadNextTransactions.getType():
      return {
        ...state,
        status: EModuleStatus.LOADING,
      };
    case actions.txHistory.setTransactions.getType(): {
      // Only set new transactions when what we have in the store differs
      // from what we have get from the api
      if (action.payload.timestampOfLastChange === state.timestampOfLastChange) {
        return {
          ...state,
          status: EModuleStatus.IDLE,
        };
      }

      return {
        ...state,
        transactionsOrder: action.payload.transactions.map(tx => tx.id),
        transactionsByHash: keyBy(action.payload.transactions, tx => tx.id),
        lastTransactionId: action.payload.lastTransactionId,
        timestampOfLastChange: action.payload.timestampOfLastChange,
        status: EModuleStatus.IDLE,
      };
    }
    case actions.txHistory.appendTransactions.getType(): {
      const order = state.transactionsOrder;
      const transactions = state.transactionsByHash;

      if (order === undefined || transactions === undefined) {
        throw new Error("Invalid tx history module state");
      }

      return {
        ...state,
        transactionsOrder: order.concat(action.payload.transactions.map(tx => tx.id)),
        transactionsByHash: {
          ...transactions,
          ...keyBy(action.payload.transactions, tx => tx.id),
        },
        lastTransactionId: action.payload.lastTransactionId,
        status: EModuleStatus.IDLE,
      };
    }

    case actions.txHistory.updateTransactions.getType(): {
      const order = state.transactionsOrder || [];
      const transactionsByHash = state.transactionsByHash || {};

      const newTransactionsIds = action.payload.transactions
        .filter(tx => !transactionsByHash[tx.id])
        .map(tx => tx.id);

      return {
        ...state,
        transactionsOrder: newTransactionsIds.concat(order),
        transactionsByHash: {
          ...transactionsByHash,
          ...keyBy(action.payload.transactions, tx => tx.id),
        },
        lastTransactionId: action.payload.lastTransactionId,
        timestampOfLastChange: action.payload.timestampOfLastChange,
      };
    }
  }

  return state;
};
