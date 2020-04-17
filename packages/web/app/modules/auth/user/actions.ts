import { createActionFactory } from "@neufund/shared-utils";

import { ELogoutReason } from "../types";

type TLogoutActionOptions = {
  logoutType?: ELogoutReason;
};

export const authUserActions = {
  finishSigning: createActionFactory("AUTH_FINISH_SIGNING"),
  logout: createActionFactory("AUTH_LOGOUT", (options: TLogoutActionOptions = {}) => options),
  userActive: createActionFactory("AUTH_USER_ACTIVE"),
  userActivityTimeout: createActionFactory("AUTH_USER_TIMEOUT"),
  refreshTimer: createActionFactory("AUTH_REFRESH_TIMER"),
};
