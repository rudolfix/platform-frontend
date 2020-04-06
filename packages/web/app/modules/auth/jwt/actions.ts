import { createActionFactory } from "@neufund/shared";

export const jwtActions = {
  jwtTimeout: createActionFactory("AUTH_JWT_TIMEOUT"),
};
