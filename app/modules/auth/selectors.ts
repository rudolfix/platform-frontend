import { IUser } from "../../lib/api/users/interfaces";
import { IAuthState } from "./reducer";

export const selectIsAuthorized = (state: IAuthState): boolean => !!(state.jwt && state.user);
export const selectUserEmail = (state: IAuthState): string | undefined =>
  state.user && (state.user.unverifiedEmail || state.user.verifiedEmail);
export const selectUser = (state: IAuthState): IUser | undefined => state.user;
export const selectBackupCodesVerified = (state: IAuthState): boolean =>
  !!state.user && !!state.user.backupCodesVerified;
export const selectIsUserEmailVerified = (state: IAuthState): boolean =>
  !!state.user && !!state.user.verifiedEmail;
export const selectIsThereUnverifiedEmail = (state: IAuthState): boolean =>
  !!state.user && !!state.user.unverifiedEmail;
