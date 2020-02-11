import { createSelector } from "reselect";

import { TxPendingWithMetadata, TxWithMetadata } from "../../../lib/api/users/interfaces";
import { TAppGlobalState } from "../../../store";
import { ETxSenderState } from "../sender/reducer";

export const selectAreTherePlatformPendingTxs = (state: TAppGlobalState): boolean => {
  const pendingTransaction = state.txMonitor.txs.pendingTransaction;
  return !!pendingTransaction && pendingTransaction.transactionStatus === ETxSenderState.MINING;
};

export const selectPlatformPendingTransaction = (
  state: TAppGlobalState,
): TxPendingWithMetadata | undefined =>
  state.txMonitor.txs.pendingTransaction as TxPendingWithMetadata | undefined;

export const selectExternalPendingTransaction = (
  state: TAppGlobalState,
): TxWithMetadata | undefined => state.txMonitor.txs.oooTransactions[0];

export const selectAreTherePendingTxs = createSelector(
  selectAreTherePlatformPendingTxs,
  selectExternalPendingTransaction,
  (areTherePlatformPendingTxs, externalPendingTransaction) =>
    areTherePlatformPendingTxs || !!externalPendingTransaction,
);
