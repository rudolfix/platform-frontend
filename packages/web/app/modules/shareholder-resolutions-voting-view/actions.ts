import { createActionFactory } from "@neufund/shared-utils";

import { EProcessState } from "../../utils/enums/processStates";

export const actions = {
  loadInvestorShareholderResolutionVotingView: createActionFactory(
    "SHAREHOLDER_RESOLUTION_VOTING_INVESTOR_LOAD",
    (proposalId: string) => ({ proposalId }),
  ),
  refreshInvestorShareholderResolutionVotingView: createActionFactory(
    "SHAREHOLDER_RESOLUTION_VOTING_INVESTOR_REFRESH",
    (proposalId: string) => ({ proposalId }),
  ),
  loadIssuerShareholderResolutionVotingView: createActionFactory(
    "SHAREHOLDER_RESOLUTION_VOTING_ISSUER_LOAD",
    (proposalId: string) => ({ proposalId }),
  ),
  setShareholderResolutionVotingViewState: createActionFactory(
    "SHAREHOLDER_RESOLUTION_VOTING_SET",
    (processState: EProcessState) => ({ processState }),
  ),
};
