import { createSimpleAction } from "../actionsUtils";

export const verifyEmailActions = {
  lockConnectedButton: () => createSimpleAction("VERIFY_EMAIL_BUTTON_LOCK"),
  freeConnectedButton: () => createSimpleAction("VERIFY_EMAIL_BUTTON_UNLOCK"),
};

//TODO: add typings to action
