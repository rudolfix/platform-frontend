import {
  ETransactionDirection,
  ETransactionType,
  ETransactionStatus,
} from "@neufund/shared-modules";

import { setupWalletViewModule, TBalance } from "modules/wallet-screen/module";

import { actions } from "./actions";
import { homeViewReducerMap } from "./reducer";
import { homeViewSagas } from "./sagas";
import * as selectors from "./selectors";
import { EViewState } from "./types";

const MODULE_ID = "wallet:home-view";

const setupHomeViewModule = () => {
  const viewModule = {
    id: MODULE_ID,
    sagas: [homeViewSagas],
    reducerMap: homeViewReducerMap,
    api: homeViewModuleApi,
  };

  return [...setupWalletViewModule(), viewModule];
};

const homeViewModuleApi = {
  actions,
  selectors,
};

export type { TBalance };
export {
  setupHomeViewModule,
  homeViewModuleApi,
  EViewState,
  ETransactionDirection,
  ETransactionType,
  ETransactionStatus,
};
