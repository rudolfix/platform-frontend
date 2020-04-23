import { DeepReadonly } from "@neufund/shared-utils";

import { IUser } from "../../lib/api/users/interfaces";
import { AppReducer } from "../../store";
import { actions } from "../actions";

export enum EAuthStatus {
  AUTHORIZED = "authorized",
  NON_AUTHORIZED = "non-authorized",
  LOGOUT_IN_PROGRESS = "logoutInProgress",
}

export interface IAuthState {
  user: IUser | undefined;
  status: EAuthStatus;
  currentAgreementHash: string | undefined;
}

const authInitialState: IAuthState = {
  user: undefined,
  status: EAuthStatus.NON_AUTHORIZED,
  currentAgreementHash: undefined,
};

export const authReducer: AppReducer<IAuthState> = (
  state = authInitialState,
  action,
): DeepReadonly<IAuthState> => {
  switch (action.type) {
    case actions.auth.setUser.getType():
      return {
        ...state,
        user: action.payload.user,
      };
    case actions.auth.logout.getType():
      return {
        ...state,
        status: EAuthStatus.LOGOUT_IN_PROGRESS,
      };
    case actions.auth.logoutDone.getType():
      return {
        ...state,
        status: EAuthStatus.NON_AUTHORIZED, //fixme is this necessary or there's a global state reset?
      };
    case actions.auth.finishSigning.getType():
      return {
        ...state,
        status: EAuthStatus.AUTHORIZED,
      };
    case actions.tosModal.setCurrentTosHash.getType():
      return {
        ...state,
        currentAgreementHash: action.payload.currentAgreementHash,
      };
    case actions.auth.reset.getType():
      return authInitialState;
    //Log out is done on whole state instead of just AUTH reducer
  }

  return state;
};
