import { createActionFactory } from "@neufund/shared-utils";

export const jwtActions = {
  jwtTimeout: createActionFactory("AUTH_JWT_TIMEOUT"),
};
