import { actions } from "./actions";
import { shareholderResolutionsVotingSetupReducerMap } from "./reducer";
import { shareholderResolutionsVotingSetupSagas } from "./sagas";
import * as selectors from "./selectors";
import { TVotingResolutionSetupData, VotingResolutionSchema } from "./types";
import { DEFAULT_VOTING_DURATION_DAYS, DEFAULT_SUBMISSION_DEADLINE_DAYS } from "./constants";

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
  TVotingResolutionSetupData,
  VotingResolutionSchema,
  DEFAULT_VOTING_DURATION_DAYS,
  DEFAULT_SUBMISSION_DEADLINE_DAYS,
};
