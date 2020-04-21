import { createActionFactory } from "@neufund/shared-utils";

export const jwtActions = {
  /**
   * @deprecated Do not use `setJWT` outside of auth module.
   */
  setJWT: createActionFactory("AUTH_SET_JWT", (jwt: string) => ({ jwt })),
};
