import { createActionFactory } from "@neufund/shared-utils";

export const jwtActions = {
  jwtTimeout: createActionFactory("AUTH_JWT_TIMEOUT"),
  stopJwtExpirationWatcher: createActionFactory("STOP_JWT_EXPIRATION_WATCHER"),
};
