import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { actions } from "./actions";
import { IResolution } from "./types";

export type TGovernanceViewState = {
  tabVisible: boolean;
  resolutions: IResolution[] | undefined;
  showGovernanceUpdateModal: boolean;
};

const initialState: TGovernanceViewState = {
  tabVisible: false,
  resolutions: undefined,
  showGovernanceUpdateModal: false,
};

export const reducer: AppReducer<TGovernanceViewState, typeof actions> = (
  state = initialState,
  action,
): DeepReadonly<TGovernanceViewState> => {
  switch (action.type) {
    case actions.loadGeneralInformationView.getType():
      return {
        ...state,
        showGovernanceUpdateModal: false,
      };
    case actions.setGovernanceVisibility.getType():
      return {
        ...state,
        tabVisible: action.payload.tabVisible,
      };
    case actions.setGovernanceResolutions.getType():
      return {
        ...state,
        resolutions: action.payload.resolutions,
      };
    case actions.toggleGovernanceUpdateModal.getType():
      return {
        ...state,
        showGovernanceUpdateModal: !state.showGovernanceUpdateModal,
      };

    default:
      return state;
  }
};

export const governanceReducerMap = {
  governance: reducer,
};
