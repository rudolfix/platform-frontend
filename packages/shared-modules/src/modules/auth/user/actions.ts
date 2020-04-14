import { createActionFactory } from "@neufund/shared";

import { IUser } from "../module";

export const userActions = {
  setUser: createActionFactory("AUTH_SET_USER", (user: IUser) => ({ user })),
  reset: createActionFactory("AUTH_RESET"),
};
