import { createAction } from "../actionsUtils";
import { EInitType } from "./reducer";

export const initActions = {
  start: (initType: EInitType) => createAction("INIT_START", { initType }),
  done: (initType: EInitType) => createAction("INIT_DONE", { initType }),
  error: (initType: EInitType, errorMsg?: string) =>
    createAction("INIT_ERROR", { initType, errorMsg }),
};
