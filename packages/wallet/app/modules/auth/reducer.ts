import { AppReducer } from "@neufund/sagas";

import { authActions } from "./actions";

export enum EAuthState {
  UNKNOWN = "unknown",
  NON_AUTHORIZED_NO_ACCOUNT = "non_authorized_no_account",
  NON_AUTHORIZED_HAS_ACCOUNT = "non_authorized_has_account",
  AUTHORIZING = "authorizing",
  AUTHORIZED = "authorized",
}

interface IAuthState {
  state: EAuthState;
}

const initialState: IAuthState = {
  state: EAuthState.UNKNOWN,
};

const authReducer: AppReducer<IAuthState, typeof authActions> = (state = initialState, action) => {
  switch (action.type) {
    case authActions.createAccount.getType():
    case authActions.importNewAccount.getType():
    case authActions.unlockAccount.getType():
      return {
        ...initialState,
        state: EAuthState.AUTHORIZING,
      };

    case authActions.signed.getType():
      return {
        ...initialState,
        state: EAuthState.AUTHORIZED,
      };

    case authActions.canCreateAccount.getType():
    case authActions.logout.getType():
    case authActions.failedToCreateAccount.getType():
    case authActions.failedToImportNewAccount.getType():
      return {
        ...initialState,
        state: EAuthState.NON_AUTHORIZED_NO_ACCOUNT,
      };

    case authActions.failedToUnlockAccount.getType():
    case authActions.canUnlockAccount.getType():
      return {
        ...initialState,
        state: EAuthState.NON_AUTHORIZED_HAS_ACCOUNT,
      };

    default:
      return state;
  }
};

const authReducerMap = {
  auth: authReducer,
};

export { authReducerMap };
