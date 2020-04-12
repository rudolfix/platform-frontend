import { AppReducer } from "@neufund/sagas";

import { authActions } from "./actions";
import { TAuthWalletMetadata } from "./types";

export enum EAuthState {
  NOT_AUTHORIZED = "not_authorized",
  AUTHORIZING = "authorizing",
  AUTHORIZED = "authorized",
}

interface IAuthState {
  state: EAuthState;
  /**
   * @note wallet can be already defined for `NOT_AUTHORIZED` state given it's taken from device storage
   */
  wallet: undefined | TAuthWalletMetadata;
}

const initialState: IAuthState = {
  state: EAuthState.NOT_AUTHORIZED,
  wallet: undefined,
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
        wallet: action.payload,
      };

    case authActions.canCreateAccount.getType():
    case authActions.logout.getType():
    case authActions.failedToCreateAccount.getType():
    case authActions.failedToImportNewAccount.getType():
      return initialState;

    case authActions.canUnlockAccount.getType():
      return {
        ...initialState,
        wallet: action.payload,
      };

    case authActions.failedToUnlockAccount.getType():
      return {
        ...initialState,
        // still keep current wallet in the store to show the proper UI
        wallet: state.wallet,
      };

    default:
      return state;
  }
};

const authReducerMap = {
  auth: authReducer,
};

export { authReducerMap };
