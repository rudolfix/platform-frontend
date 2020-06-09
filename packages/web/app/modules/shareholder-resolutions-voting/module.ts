import { actions } from "./actions";
import { shareholderResolutionsVotingMap } from "./reducer";
import { shareholderResolutionsVotingSagas } from "./sagas";
import * as selectors from "./selectors";
import { IShareholderVote, TProposal } from "./types";
import { calculateParticipation, calculateShareholderParticipation } from "./utils";

const MODULE_ID = "web:shareholder-resolutions-voting";

const setupShareholderResolutionsVotingModule = () => ({
  id: MODULE_ID,
  sagas: [shareholderResolutionsVotingSagas],
  reducerMap: shareholderResolutionsVotingMap,
  api: shareholderResolutionsVotingModuleApi,
});

const shareholderResolutionsVotingModuleApi = {
  actions,
  selectors,
  utils: {
    calculateParticipation,
    calculateShareholderParticipation,
  },
};

export {
  setupShareholderResolutionsVotingModule,
  shareholderResolutionsVotingModuleApi,
  IShareholderVote,
  TProposal,
};
