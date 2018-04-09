import { IUser } from "../../lib/api/users/interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

export const authActions = {
  loadJWT: (jwt: string) => createAction("AUTH_LOAD_JWT", { jwt }),
  loadUser: (user: IUser) => createAction("AUTH_LOAD_USER", { user }),
  logout: () => createSimpleAction("AUTH_LOGOUT"),
  verifyEmail: () => createSimpleAction("AUTH_VERIFY_EMAIL"),
};
