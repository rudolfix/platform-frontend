import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { actions } from "./actions";
import { IShareholderVote, TProposal } from "./types";

interface IShareholderResolutionsVotingState {
  shareholdersVotes: Record<string, IShareholderVote[] | undefined>;
  proposals: Record<string, TProposal | undefined>;
}

const shareholderResolutionsVotingInitialState: IShareholderResolutionsVotingState = {
  proposals: {},
  shareholdersVotes: {},
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
