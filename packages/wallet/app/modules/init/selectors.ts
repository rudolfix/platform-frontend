import { TAppGlobalState } from "../../store/types";

const selectInitStatus = (state: TAppGlobalState) => state.init.status;

export { selectInitStatus };
