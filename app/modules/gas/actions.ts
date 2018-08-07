import { GasModelShape } from "../../lib/api/GasApi";
import { createAction, createSimpleAction } from "../actionsUtils";

export const gasActions = {
  gasApiEnsureLoading: () => createSimpleAction("GAS_API_ENSURE_LOADING"),
  gasApiStartLoading: () => createSimpleAction("GAS_API_START_LOADING"),
  gasApiLoaded: (payload: { data?: GasModelShape; error?: string }) =>
    createAction("GAS_API_LOADED", payload),
};
