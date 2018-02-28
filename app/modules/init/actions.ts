import { createAction, createSimpleAction } from "../actionsUtils";

export const initActions = {
  start: () => createSimpleAction("INIT_START"),
  done: () => createSimpleAction("INIT_DONE"),
  error: (errorMsg?: string) => createAction("INIT_ERROR", { errorMsg }),
};
