import { createSimpleAction } from "../actionsUtils";

export const connectedButtonActions = {
  lockConnectedButton: () => createSimpleAction("CONNECTED_BUTTON_LOCK"),
  freeConnectedButton: () => createSimpleAction("CONNECTED_BUTTON_UNLOCK"),
};

//TODO: add typings to action
