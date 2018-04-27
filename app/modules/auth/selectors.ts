import * as queryString from "query-string";
import { RouterState } from "react-router-redux";
import { IUser, TUserType } from "../../lib/api/users/interfaces";
import { IAuthState } from "./reducer";

export const selectRedirectURLFromQueryString = (state: RouterState): string | undefined => {
  if (!(state.location && state.location.search)) {
    return undefined;
  }
  const params = queryString.parse(state.location.search);
  const redirect = params.redirect;

  if (!redirect) {
    return undefined;
  }

  return redirect;
};

export const selectIsAuthorized = (state: IAuthState): boolean => !!(state.jwt && state.user);
export const selectUserType = (state: IAuthState): TUserType | undefined =>
  state.user && state.user.type;
export const selectUserEmail = (state: IAuthState): string | undefined =>
  state.user && (state.user.unverifiedEmail || state.user.verifiedEmail);
export const selectVerifiedUserEmail = (state: IAuthState): string | undefined =>
  state.user && state.user.verifiedEmail;
export const selectUser = (state: IAuthState): IUser | undefined => state.user;
export const selectBackupCodesVerified = (state: IAuthState): boolean =>
  !!state.user && !!state.user.backupCodesVerified;
export const selectIsUserEmailVerified = (state: IAuthState): boolean =>
  !!state.user && !!state.user.verifiedEmail;
export const selectIsThereUnverifiedEmail = (state: IAuthState): boolean =>
  !!state.user && !!state.user.unverifiedEmail;
export const selectDoesEmailExist = (state: IAuthState): boolean =>
  selectIsThereUnverifiedEmail(state) && selectIsUserEmailVerified(state);
