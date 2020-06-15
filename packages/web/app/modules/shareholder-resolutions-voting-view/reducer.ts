import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { EProcessState } from "../../utils/enums/processStates";
import { actions } from "./actions";
import { EShareholderResolutionProposalViewType } from "./types";

export interface IShareholderResolutionsVotingViewState {
  viewType: EShareholderResolutionProposalViewType | undefined;
  proposalId: string | undefined;
  processState: EProcessState;
}

const initialState: IShareholderResolutionsVotingViewState = {
  viewType: undefined,
  proposalId: undefined,
  processState: EProcessState.NOT_STARTED,
};

export const reducer: AppReducer<IShareholderResolutionsVotingViewState, typeof actions> = (
  state = initialState,
  action,
): DeepReadonly<IShareholderResolutionsVotingViewState> => {
  switch (action.type) {
    case actions.loadInvestorShareholderResolutionVotingView.getType(): {
      const { proposalId } = action.payload;

      return {
        ...state,
        proposalId,
        viewType: EShareholderResolutionProposalViewType.VIEW_INVESTOR,
        processState: EProcessState.IN_PROGRESS,
      };
    }

    case actions.loadIssuerShareholderResolutionVotingView.getType(): {
      const { proposalId } = action.payload;

      return {
        ...state,
        proposalId,
        viewType: EShareholderResolutionProposalViewType.VIEW_ISSUER,
        processState: EProcessState.IN_PROGRESS,
      };
    }

    case actions.setShareholderResolutionVotingViewState.getType(): {
      const { processState } = action.payload;

      return {
        ...state,
        processState,
      };
    }

    default:
      return state;
  }
};

const shareholderResolutionsVotingViewMap = {
  shareholderResolutionsVotingView: reducer,
};

export { shareholderResolutionsVotingViewMap };
