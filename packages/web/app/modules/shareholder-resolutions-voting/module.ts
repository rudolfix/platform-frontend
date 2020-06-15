import {
  ProposalNotFoundError,
  ProposalStateNotSupportedError,
  ShareholderHasNoAccessToProposalError,
} from "./errors";
import { shareholderResolutionsVotingMap } from "./reducer";
import { loadInvestorShareholderResolution, loadIssuerShareholderResolution } from "./sagas";
import * as selectors from "./selectors";
import { EProposalState, IShareholderVote, TProposal } from "./types";
import {
  calculateAbstainedParticipationPercentage,
  calculateAbstainedParticipationTokens,
  calculateAgainstParticipationPercentage,
  calculateInFavorParticipationPercentage,
  calculateParticipationPercentage,
  calculateShareholderParticipationPercentage,
} from "./utils";

const MODULE_ID = "web:shareholder-resolutions-voting";

const setupShareholderResolutionsVotingModule = () => ({
  id: MODULE_ID,
  sagas: [],
  reducerMap: shareholderResolutionsVotingMap,
  api: shareholderResolutionsVotingModuleApi,
});

const shareholderResolutionsVotingModuleApi = {
  selectors,
  sagas: {
    loadIssuerShareholderResolution,
    loadInvestorShareholderResolution,
  },
  utils: {
    calculateParticipationPercentage,
    calculateInFavorParticipationPercentage,
    calculateShareholderParticipationPercentage,
    calculateAbstainedParticipationPercentage,
    calculateAgainstParticipationPercentage,
    calculateAbstainedParticipationTokens,
  },
  errors: {
    ProposalNotFoundError,
    ShareholderHasNoAccessToProposalError,
    ProposalStateNotSupportedError,
  },
};

export {
  setupShareholderResolutionsVotingModule,
  shareholderResolutionsVotingModuleApi,
  IShareholderVote,
  TProposal,
  EProposalState,
};
