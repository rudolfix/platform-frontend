import { IUser } from "../../lib/api/users/interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IAuthState {
  user?: IUser;
  jwt?: string;
}

const authInitialState: IAuthState = {};

export const authReducer: AppReducer<IAuthState> = (
  state = authInitialState,
  action,
): DeepReadonly<IAuthState> => {
  switch (action.type) {
    case "AUTH_LOAD_USER":
      return {
        ...state,
        user: action.payload.user,
      };
    case "AUTH_LOAD_JWT":
      return {
        ...state,
        jwt: action.payload.jwt,
      };
    //Log out is done on whole initial state instead of just AUTH reducer
  }

  return state;
};

export const selectIsAuthorized = (state: IAuthState): boolean => !!(state.jwt && state.user);
export const selectUserEmail = (state: IAuthState): string | undefined =>
  state.user && (state.user.unverifiedEmail || state.user.verifiedEmail);
export const selectUser = (state: IAuthState): IUser | undefined => state.user;
export const selectBackupCodesVerified = (state: IAuthState): boolean | undefined =>
  state.user && state.user.backupCodesVerified;
