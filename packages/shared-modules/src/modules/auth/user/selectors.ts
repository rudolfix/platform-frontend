import { StateFromReducersMapObject } from "redux";

import { IUser } from "../lib/users/interfaces";
import { userReducerMap } from "./reducer";

const selectUser = (state: StateFromReducersMapObject<typeof userReducerMap>): IUser | undefined =>
  state.user.data;

export { selectUser };
