import { TAppGlobalState } from "../../store/types";

const selectInitStatus = (state: TAppGlobalState) => state.init.status;

const selectTest = (state: TAppGlobalState) => state.init.db;

export { selectInitStatus, selectTest };
