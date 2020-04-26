import { createActionFactory } from "@neufund/shared-utils";

import { EInitType } from "./reducer";

export const initActions = {
  start: createActionFactory("INIT_START", (initType: EInitType) => ({ initType })),
  done: createActionFactory("INIT_DONE", (initType: EInitType) => ({ initType })),
  error: createActionFactory("INIT_ERROR", (initType: EInitType, errorMsg?: string) => ({
    initType,
    errorMsg,
  })),
  startServices: createActionFactory("START_SERVICES"),
  restartServices: createActionFactory("RESTART_SERVICES"),
  stopServices: createActionFactory("STOP_SERVICES"),
};
