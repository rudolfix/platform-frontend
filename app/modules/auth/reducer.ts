import { IUser } from "../../lib/api/users/interfaces";
import { AppReducer } from "../../store";

export interface IAuthState {
  user?: IUser;
  jwt?: string;
}

const authInitialState: IAuthState = {};

export const authReducer: AppReducer<IAuthState> = (
  state = authInitialState,
  action,
): IAuthState => {
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
    case "AUTH_LOGOUT":
      return authInitialState;
  }

  return state;
};

export const selectIsAuthorized = (state: IAuthState): boolean => !!(state.jwt && state.user);
export const selectUserEmail = (state: IAuthState): string | undefined =>
  state.user && (state.user.unverifiedEmail || state.user.verifiedEmail);
