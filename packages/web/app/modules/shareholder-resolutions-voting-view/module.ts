import { setupShareholderResolutionsVotingModule } from "../shareholder-resolutions-voting/module";
import { actions } from "./actions";
import { shareholderResolutionsVotingViewMap } from "./reducer";
import { shareholderResolutionsVotingSagas } from "./sagas";
import * as selectors from "./selectors";
import { EShareholderResolutionProposalViewType } from "./types";

const MODULE_ID = "web:shareholder-resolutions-voting-view";

const setupShareholderResolutionsVotingViewModule = () => {
  const viewModule = {
    id: MODULE_ID,
    sagas: [shareholderResolutionsVotingSagas],
    reducerMap: shareholderResolutionsVotingViewMap,
    api: shareholderResolutionsVotingViewModuleApi,
  };

  return [setupShareholderResolutionsVotingModule(), viewModule];
};

const shareholderResolutionsVotingViewModuleApi = {
  actions,
  selectors,
};

export {
  setupShareholderResolutionsVotingViewModule,
  shareholderResolutionsVotingViewModuleApi,
  EShareholderResolutionProposalViewType,
};
