import { SagaGenerator } from "@neufund/sagas";
import {
  setupWalletModule,
  setupTxHistoryModule,
  ETransactionDirection,
  TTxHistory,
  ETransactionType,
  ETransactionStatus,
} from "@neufund/shared-modules";

import { actions } from "./actions";
import { walletViewMap } from "./reducer";
import { walletViewSagas } from "./sagas";
import * as selectors from "./selectors";
import { EViewState, TBalance, EBalanceViewType, TxHistoryPaginated } from "./types";
import { hasFunds, isMainBalance } from "./utils";

const MODULE_ID = "wallet:wallet-screen";

// eslint-disable-next-line @typescript-eslint/no-empty-function
function* waitUntilSmartContractsAreInitialized(): SagaGenerator<void> {}

const setupWalletViewModule = () => {
  const viewModule = {
    id: MODULE_ID,
    sagas: [walletViewSagas],
    reducerMap: walletViewMap,
    api: walletViewModuleApi,
  };

  return [
    setupTxHistoryModule({
      refreshOnAction: undefined,
    }),
    setupWalletModule({
      waitUntilSmartContractsAreInitialized,
    }),
    viewModule,
  ];
};

const walletViewModuleApi = {
  actions,
  selectors,
  utils: {
    isMainBalance,
    hasFunds,
  },
};

export type { TBalance, TxHistoryPaginated, TTxHistory };
export {
  setupWalletViewModule,
  walletViewModuleApi,
  EViewState,
  EBalanceViewType,
  ETransactionDirection,
  ETransactionType,
  ETransactionStatus,
};
