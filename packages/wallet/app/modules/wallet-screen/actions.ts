import { createActionFactory } from "@neufund/shared-utils";

import { EScreenState } from "modules/types";

export const actions = {
  loadWalletScreen: createActionFactory("WALLET_SCREEN_LOAD"),
  refreshWalletScreen: createActionFactory("WALLET_SCREEN_REFRESH"),
  setWalletScreenState: createActionFactory(
    "WALLET_SCREEN_SET_STATE",
    (screenState: EScreenState) => ({
      screenState,
    }),
  ),
};
