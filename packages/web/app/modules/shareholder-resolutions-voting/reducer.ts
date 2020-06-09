import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { actions } from "./actions";
import { IShareholderVote, TProposal } from "./types";

export interface IShareholderResolutionsVotingState {
  shareholdersVotes: Record<string, IShareholderVote[] | undefined>;
  proposals: Record<string, TProposal | undefined>;
}

export const shareholderResolutionsVotingInitialState: IShareholderResolutionsVotingState = {
  proposals: {},
  shareholdersVotes: {},
};

export const shareholderResolutionsVotingReducer: AppReducer<
  IShareholderResolutionsVotingState,
  typeof actions
> = (
  state = shareholderResolutionsVotingInitialState,
  action,
): DeepReadonly<IShareholderResolutionsVotingState> => {
  switch (action.type) {
    case actions.setShareholderResolutionVoting.getType():
      const { proposal, shareholderVote } = action.payload;

      const currentShareholderVotes = state.shareholdersVotes[shareholderVote.address] ?? [];

      return {
        ...state,
        proposals: { ...state.proposals, [proposal.id]: proposal },
        shareholdersVotes: {
          ...state.shareholdersVotes,
          [shareholderVote.address]: currentShareholderVotes
            .filter(sV => sV.proposalId !== proposal.id)
            .concat(shareholderVote),
        },
      };

    default:
      return state;
  }
};

const shareholderResolutionsVotingMap = {
  shareholderResolutionsVoting: shareholderResolutionsVotingReducer,
};

export { shareholderResolutionsVotingMap };
