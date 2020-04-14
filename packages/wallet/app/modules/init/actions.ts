import { createActionFactory } from "@neufund/shared-utils";

export const initActions = {
  // TODO remove after testing storage
  db: createActionFactory("DB", (test: unknown) => ({ test })),
  start: createActionFactory("INIT_START"),
  done: createActionFactory("INIT_DONE"),
  error: createActionFactory("INIT_ERROR", (errorMsg?: string) => ({
    errorMsg,
  })),
};
