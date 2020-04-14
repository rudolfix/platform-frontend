import { createActionFactory } from "@neufund/shared";

export const initActions = {
  start: createActionFactory("INIT_START"),
  done: createActionFactory("INIT_DONE"),
  error: createActionFactory("INIT_ERROR", (errorMsg?: string) => ({
    errorMsg,
  })),
};
