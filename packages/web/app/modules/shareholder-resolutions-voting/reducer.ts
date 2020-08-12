import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { actions } from "./actions";
import {
  IShareCapitalBreakdown,
  IShareholderVote,
  ITokenHolderBreakdown,
  TProposal,
} from "./types";

interface IShareholderResolutionsVotingState {
  shareholdersVotes: Record<string, IShareholderVote[] | undefined>;
  proposals: Record<string, TProposal | undefined>;
  nomineeShareBreakdown: Record<string, ITokenHolderBreakdown | undefined>;
  shareCapitalBreakdown: Record<string, IShareCapitalBreakdown | undefined>;
}

const shareholderResolutionsVotingInitialState: IShareholderResolutionsVotingState = {
  proposals: {},
  shareholdersVotes: {},
  nomineeShareBreakdown: {},
  shareCapitalBreakdown: {},
};

const shareholderResolutionsVotingReducer: AppReducer<
  IShareholderResolutionsVotingState,
  typeof actions
> = (
  state = shareholderResolutionsVotingInitialState,
  action,
): DeepReadonly<IShareholderResolutionsVotingState> => {
  switch (action.type) {
    case actions.setShareholderResolutionVotingProposalShareholderVote.getType(): {
      const { proposalId, shareholderVote } = action.payload;

      const currentShareholderVotes = state.shareholdersVotes[shareholderVote.address] ?? [];

      return {
        ...state,
        shareholdersVotes: {
          ...state.shareholdersVotes,
          [shareholderVote.address]: currentShareholderVotes
            .filter(sV => sV.proposalId !== proposalId)
            .concat(shareholderVote),
        },
      };
    }

    case actions.setNomineeShareholderVoteBreakdown.getType(): {
      const { proposalId, nomineeShareBreakdown } = action.payload;

      return {
        ...state,
        nomineeShareBreakdown: {
          ...state.nomineeShareBreakdown,
          [proposalId]: nomineeShareBreakdown,
        },
      };
    }

    case actions.setShareCapitalBreakdown.getType(): {
      const { proposalId, shareCapitalBreakdown } = action.payload;

      return {
        ...state,
        shareCapitalBreakdown: {
          ...state.shareCapitalBreakdown,
          [proposalId]: shareCapitalBreakdown,
        },
      };
    }

    case actions.setShareholderResolutionVotingProposal.getType(): {
      const { proposal } = action.payload;

      return {
        ...state,
        proposals: { ...state.proposals, [proposal.id]: proposal },
      };
    }
    default:
      return state;
  }
};

const shareholderResolutionsVotingMap = {
  shareholderResolutionsVoting: shareholderResolutionsVotingReducer,
};

export {
  shareholderResolutionsVotingMap,
  shareholderResolutionsVotingReducer,
  shareholderResolutionsVotingInitialState,
  IShareholderResolutionsVotingState,
};
