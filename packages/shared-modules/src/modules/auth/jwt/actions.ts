import { createActionFactory } from "@neufund/shared";

export const jwtActions = {
  /**
   * @deprecated Do not use `setJWT` outside of auth module.
   */
  setJWT: createActionFactory("AUTH_SET_JWT", (jwt: string) => ({ jwt })),
  stopJwtExpirationWatcher: createActionFactory("STOP_JWT_EXPIRATION_WATCHER"),
};
