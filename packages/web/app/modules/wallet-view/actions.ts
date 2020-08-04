import { createActionFactory } from "@neufund/shared-utils";

import { TWalletViewState } from "./types";

export const walletViewActions = {
  loadWalletView: createActionFactory("LOAD_WALLET_VIEW"),
  walletViewSetData: createActionFactory("WALLET_VIEW_SET_DATA", (data: TWalletViewState) => data),
  loadNextTransactions: createActionFactory("WALLET_VIEW_LOAD_NEXT_TRANSACTIONS"),
  showTransactionDetails: createActionFactory(
    "WALLET_VIEW_SHOW_TRANSACTION_DETAILS",
    (id: string) => ({ id }),
  ),
};
