import { createActionFactory } from "@neufund/shared-utils";

import { EScreenState } from "modules/types";

export const actions = {
  loadPortfolioScreen: createActionFactory("PORTFOLIO_SCREEN_LOAD"),
  refreshPortfolioScreen: createActionFactory("PORTFOLIO_SCREEN_REFRESH"),
  setPortfolioScreenState: createActionFactory(
    "PORTFOLIO_SCREEN_SET_STATE",
    (screenState: EScreenState) => ({
      screenState,
    }),
  ),
};
