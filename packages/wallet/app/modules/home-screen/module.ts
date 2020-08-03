import {
  ETransactionDirection,
  ETransactionType,
  ETransactionStatus,
} from "@neufund/shared-modules";

import { actions } from "./actions";
import { homeScreenReducerMap } from "./reducer";
import { homeScreenSagas } from "./sagas";
import * as selectors from "./selectors";
import { TBalance } from "./types";

const MODULE_ID = "wallet:home-screen";

const setupHomeScreenModule = () => {
  const viewModule = {
    id: MODULE_ID,
    sagas: [homeScreenSagas],
    reducerMap: homeScreenReducerMap,
    api: homeScreenModuleApi,
  };

  return [viewModule];
};

const homeScreenModuleApi = {
  actions,
  selectors,
};

export type { TBalance };
export {
  setupHomeScreenModule,
  homeScreenModuleApi,
  ETransactionDirection,
  ETransactionType,
  ETransactionStatus,
};
