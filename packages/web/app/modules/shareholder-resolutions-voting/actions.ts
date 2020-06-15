import { createActionFactory } from "@neufund/shared-utils";

import { IShareholderVote, TProposal } from "./types";

export const actions = {
  setShareholderResolutionVotingProposal: createActionFactory(
    "SHAREHOLDER_RESOLUTION_VOTING_PROPOSAL_SET",
    (proposal: TProposal) => ({ proposal }),
  ),
  setShareholderResolutionVotingProposalShareholderVote: createActionFactory(
    "SHAREHOLDER_RESOLUTION_VOTING_SHAREHOLDER_VOTE_SET",
    (proposalId: string, shareholderVote: IShareholderVote) => ({ proposalId, shareholderVote }),
  ),
};
