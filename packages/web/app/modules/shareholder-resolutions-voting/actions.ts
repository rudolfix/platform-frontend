import { createActionFactory } from "@neufund/shared-utils";

import {
  IShareCapitalBreakdown,
  IShareholderVote,
  ITokenHolderBreakdown,
  TProposal,
} from "./types";

export const actions = {
  setShareholderResolutionVotingProposal: createActionFactory(
    "SHAREHOLDER_RESOLUTION_VOTING_PROPOSAL_SET",
    (proposal: TProposal) => ({ proposal }),
  ),
  setNomineeShareholderVoteBreakdown: createActionFactory(
    "NOMINEE_SHAREHOLDER_VOTING_BREAKDOWN_SET",
    (proposalId: string, nomineeShareBreakdown: ITokenHolderBreakdown) => ({
      nomineeShareBreakdown,
      proposalId,
    }),
  ),
  setShareCapitalBreakdown: createActionFactory(
    "SHARE_CAPITAL_BREAKDOWN_SET",
    (proposalId: string, shareCapitalBreakdown: IShareCapitalBreakdown) => ({
      shareCapitalBreakdown,
      proposalId,
    }),
  ),
  setShareholderResolutionVotingProposalShareholderVote: createActionFactory(
    "SHAREHOLDER_RESOLUTION_VOTING_SHAREHOLDER_VOTE_SET",
    (proposalId: string, shareholderVote: IShareholderVote) => ({ proposalId, shareholderVote }),
  ),
};
