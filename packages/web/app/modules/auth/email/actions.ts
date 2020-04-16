import { createActionFactory } from "@neufund/shared-utils";

export const emailActions = {
  verifyEmail: createActionFactory("AUTH_VERIFY_EMAIL"),
};
