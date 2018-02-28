import { createSimpleAction } from "../actionsUtils";

export const appActions = {
  start: () => createSimpleAction("INIT_START"),
  done: () => createSimpleAction("INIT_DONE"),
  error: () => createSimpleAction("INIT_ERROR"),
};
