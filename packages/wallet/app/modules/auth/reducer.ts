import { AppReducer } from "@neufund/sagas";

import { authActions } from "./actions";

export enum EAuthState {
  NON_AUTHORIZED = "non_authorized",
  AUTHORIZING = "authorizing",
  AUTHORIZED = "authorized",
}

interface IAuthState {
  state: EAuthState;
}

const initialState: IAuthState = {
  state: EAuthState.NON_AUTHORIZED,
};

const authReducer: AppReducer<IAuthState, typeof authActions> = (state = initialState, action) => {
  switch (action.type) {
    case authActions.createNewAccount.getType():
    case authActions.importNewAccount.getType():
      return {
        ...initialState,
        state: EAuthState.AUTHORIZING,
      };

    case authActions.signed.getType():
      return {
        ...initialState,
        state: EAuthState.AUTHORIZED,
      };

    case authActions.failedToCreateNewAccount.getType():
    case authActions.failedToImportNewAccount.getType():
    case authActions.logout.getType():
      return initialState;

    default:
      return state;
  }
};

export { authReducer };
