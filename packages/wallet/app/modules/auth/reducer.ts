import { AppReducer } from "@neufund/sagas";

import { authActions } from "./actions";
import { TAuthWalletMetadata } from "./types";

export enum EAuthState {
  NOT_AUTHORIZED = "not_authorized",
  AUTHORIZING = "authorizing",
  AUTHORIZED = "authorized",
  LOST = "lost",
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

// eslint-disable-next-line complexity
const authReducer: AppReducer<IAuthState, typeof authActions> = (state = initialState, action) => {
  switch (action.type) {
    case authActions.createAccount.getType():
    case authActions.importAccount.getType():
    case authActions.unlockAccount.getType():
      return {
        ...initialState,
        // still keep current wallet in the store to show the proper UI
        wallet: state.wallet,
        state: EAuthState.AUTHORIZING,
      };

    case authActions.unlockAccountDone.getType():
      return {
        ...initialState,
        state: EAuthState.AUTHORIZED,
        wallet: action.payload.metadata,
      };

    case authActions.canCreateAccount.getType():
    case authActions.logoutAccountDone.getType():
    case authActions.failedToCreateAccount.getType():
    case authActions.failedToImportAccount.getType():
      return initialState;

    case authActions.canUnlockAccount.getType():
      return {
        ...initialState,
        wallet: action.payload.metadata,
      };

    case authActions.lockAccount.getType():
      return {
        ...initialState,
        state: EAuthState.NOT_AUTHORIZED,
        wallet: state.wallet,
      };

    case authActions.failedToUnlockAccount.getType():
      return {
        ...initialState,
        // still keep current wallet in the store to show the proper UI
        wallet: state.wallet,
      };

    case authActions.accountLost.getType():
      return {
        ...initialState,
        state: EAuthState.LOST,
        wallet: action.payload.metadata,
      };

    default:
      return state;
  }
};

const authReducerMap = {
  auth: authReducer,
};

export { authReducerMap };
