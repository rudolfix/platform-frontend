import { createActionFactory } from "@neufund/shared-utils";

import { IUser } from "../module";

export const userPrivateActions = {
  reset: createActionFactory("AUTH_RESET"),
};

export const userActions = {
  setUser: createActionFactory("AUTH_SET_USER", (user: IUser) => ({ user })),
};
