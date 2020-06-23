import { StateFromReducersMapObject } from "redux";
import { createSelector } from "reselect";

import { IUser } from "../lib/users/interfaces";
import { userReducerMap } from "./reducer";

type TState = StateFromReducersMapObject<typeof userReducerMap>;

const selectUser = (state: TState): IUser | undefined => state.user.data;

/**
 * Check if user has verified email
 */
const selectVerifiedUserEmail = createSelector(
  selectUser,
  (user: IUser | undefined): string | undefined => user?.verifiedEmail,
);

const selectIsUserEmailVerified = (state: TState): boolean => !!selectVerifiedUserEmail(state);

export { selectUser, selectIsUserEmailVerified, selectVerifiedUserEmail };
