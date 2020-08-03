import { EthereumAddressWithChecksum } from "@neufund/shared-utils";
import { StateFromReducersMapObject } from "redux";
import { createSelector } from "reselect";

import { EUserType, IUser } from "../lib/users/interfaces";
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

const selectUserType = createSelector(
  selectUser,
  (user: IUser | undefined): EUserType | undefined => user?.type,
);

const selectUserId = createSelector(
  selectUser,
  (user: IUser | undefined): EthereumAddressWithChecksum | undefined => user?.userId,
);

export {
  selectUser,
  selectIsUserEmailVerified,
  selectVerifiedUserEmail,
  selectUserId,
  selectUserType,
};
