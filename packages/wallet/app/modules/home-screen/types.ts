import { txHistoryApi, TModuleState } from "@neufund/shared-modules";

import { setupHomeViewModule } from "modules/home-screen/module";

export type TWalletViewModuleState = TModuleState<typeof setupHomeViewModule>;

export enum EViewState {
  INITIAL = "initial",
  LOADING = "loading",
  REFRESHING = "refreshing",
  READY = "ready",
  ERROR = "error",
}

export type TxHistoryPaginated = ReturnType<typeof txHistoryApi.selectors.selectTxHistoryPaginated>;
