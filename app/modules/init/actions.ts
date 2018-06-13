import { createAction } from "../actionsUtils";
import { TInitType } from "./reducer";

export const initActions = {
  start: (initType: TInitType) => createAction("INIT_START", { initType }),
  done: (initType: TInitType) => createAction("INIT_DONE", { initType }),
  error: (initType: TInitType, errorMsg?: string) =>
    createAction("INIT_ERROR", { initType, errorMsg }),
};
