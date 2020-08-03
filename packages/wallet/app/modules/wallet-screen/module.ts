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
import { walletScreenMap } from "./reducer";
import { walletScreenSagas } from "./sagas";
import * as selectors from "./selectors";
import { TBalance, EBalanceViewType, TxHistoryPaginated } from "./types";
import { hasFunds, isMainBalance } from "./utils";

const MODULE_ID = "wallet:wallet-screen";

// eslint-disable-next-line @typescript-eslint/no-empty-function
function* waitUntilSmartContractsAreInitialized(): SagaGenerator<void> {}

const setupWalletScreenModule = () => {
  const viewModule = {
    id: MODULE_ID,
    sagas: [walletScreenSagas],
    reducerMap: walletScreenMap,
    api: walletScreenModuleApi,
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

const walletScreenModuleApi = {
  actions,
  selectors,
  utils: {
    isMainBalance,
    hasFunds,
  },
};

export type { TBalance, TxHistoryPaginated, TTxHistory };
export {
  setupWalletScreenModule,
  walletScreenModuleApi,
  EBalanceViewType,
  ETransactionDirection,
  ETransactionType,
  ETransactionStatus,
};
