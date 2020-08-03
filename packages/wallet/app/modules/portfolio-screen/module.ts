import {
  ETransactionDirection,
  ETransactionType,
  ETransactionStatus,
} from "@neufund/shared-modules";

import { actions } from "./actions";
import { portfolioScreenReducerMap } from "./reducer";
import { portfolioScreenSagas } from "./sagas";
import * as selectors from "./selectors";
import { TAsset } from "./types";

const MODULE_ID = "wallet:portfolio-screen";

const setupPortfolioScreenModule = () => {
  const viewModule = {
    id: MODULE_ID,
    sagas: [portfolioScreenSagas],
    reducerMap: portfolioScreenReducerMap,
    api: portfolioScreenModuleApi,
  };

  return [viewModule];
};

const portfolioScreenModuleApi = {
  actions,
  selectors,
};

export type { TAsset };
export {
  setupPortfolioScreenModule,
  portfolioScreenModuleApi,
  ETransactionDirection,
  ETransactionType,
  ETransactionStatus,
};
