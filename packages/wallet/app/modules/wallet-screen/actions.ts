import { createActionFactory } from "@neufund/shared-utils";

import { EViewState } from "./types";

export const actions = {
  loadWalletView: createActionFactory("WALLET_VIEW_LOAD"),
  refreshWalletView: createActionFactory("WALLET_VIEW_REFRESH"),
  setWalletViewState: createActionFactory("WALLET_VIEW_SET_STATE", (viewState: EViewState) => ({
    viewState,
  })),
};
