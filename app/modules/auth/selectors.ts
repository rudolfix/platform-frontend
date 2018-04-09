import { IUser } from "../../lib/api/users/interfaces";
import { IAuthState } from "./reducer";

export const selectIsAuthorized = (state: IAuthState): boolean => !!(state.jwt && state.user);
export const selectUserEmail = (state: IAuthState): string | undefined =>
  state.user && (state.user.unverifiedEmail || state.user.verifiedEmail);
export const selectUser = (state: IAuthState): IUser | undefined => state.user;
export const selectBackupCodesVerified = (state: IAuthState): boolean | undefined =>
  state.user && state.user.backupCodesVerified;
export const selectIsUserEmailVerified = (state: IAuthState): boolean | undefined =>
  state.user && !!state.user.verifiedEmail && !state.user.unverifiedEmail;
export const selectIsThereUnverifiedEmail = (state: IAuthState): boolean | undefined =>
  state.user && !!state.user.unverifiedEmail;
