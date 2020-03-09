import { createActionFactory } from "@neufund/shared";

export const initActions = {
  start: createActionFactory("INIT_START"),
  done: createActionFactory("INIT_DONE"),
  // TODO remove after testing storage
  db: createActionFactory("DB", (test: unknown) => ({ test })),
  error: createActionFactory("INIT_ERROR", (errorMsg?: string) => ({
    errorMsg,
  })),
};
