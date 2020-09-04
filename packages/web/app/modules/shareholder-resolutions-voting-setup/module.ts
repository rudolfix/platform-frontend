import { actions } from "./actions";
import { shareholderResolutionsVotingSetupReducerMap } from "./reducer";
import { shareholderResolutionsVotingSetupSagas } from "./sagas";
import * as selectors from "./selectors";

const MODULE_ID = "web:shareholder-resolutions-voting-setup";

const shareholderResolutionsVotingSetupModuleApi = {
  actions,
  selectors,
};

const setupShareholderResolutionsVotingSetupModule = () => ({
  id: MODULE_ID,
  sagas: [shareholderResolutionsVotingSetupSagas],
  reducerMap: shareholderResolutionsVotingSetupReducerMap,
  api: shareholderResolutionsVotingSetupModuleApi,
});

export {
  setupShareholderResolutionsVotingSetupModule,
  shareholderResolutionsVotingSetupModuleApi,
};
