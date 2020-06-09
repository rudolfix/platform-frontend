import { createActionFactory } from "@neufund/shared-utils";

import { IShareholderVote, TProposal } from "./types";

export const actions = {
  loadShareholderResolutionVoting: createActionFactory(
    "SHAREHOLDER_RESOLUTION_VOTING_LOAD",
    (proposalId: string) => ({ proposalId }),
  ),

  setShareholderResolutionVoting: createActionFactory(
    "SHAREHOLDER_RESOLUTION_VOTING_SET",
    (proposal: TProposal, shareholderVote: IShareholderVote) => ({ proposal, shareholderVote }),
  ),
};
