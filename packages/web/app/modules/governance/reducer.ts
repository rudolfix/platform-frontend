import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { EProcessState } from "../../utils/enums/processStates";
import { actions } from "./actions";
import { TGovernanceViewState } from "./types";

const initialState: TGovernanceViewState = {
  tabVisible: false,
  processState: EProcessState.NOT_STARTED,
};

export const reducer: AppReducer<TGovernanceViewState, typeof actions> = (
  state = initialState,
  action,
): DeepReadonly<TGovernanceViewState> => {
  switch (action.type) {
    case actions.setGovernanceVisibility.getType():
      return {
        ...state,
        tabVisible: action.payload.tabVisible,
      };
    case actions.setGovernanceUpdateData.getType():
      return action.payload.data;
    default:
      return state;
  }
};

export const governanceReducerMap = {
  governance: reducer,
};
