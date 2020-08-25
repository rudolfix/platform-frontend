import { initializeBiometrics } from "modules/biometry/sagas";
import { selectBiometricsState, selectBiometricsType } from "modules/biometry/selectors";

import { setupBindings } from "./lib/bindings";
import { biometricsReducerMap, EBiometricsState } from "./reducer";
import { EBiometryType, BIOMETRY_NONE, TBiometryNone } from "./types";

const MODULE_ID = "wallet:biometry";

const setupBiometryModule = () => ({
  id: MODULE_ID,
  libs: [setupBindings()],
  reducerMap: biometricsReducerMap,
  api: biometryModuleApi,
});

const biometryModuleApi = {
  sagas: {
    initializeBiometrics,
  },
  selectors: {
    selectBiometricsState,
    selectBiometricsType,
  },
};

export type { TBiometryNone };
export { setupBiometryModule, biometryModuleApi, EBiometricsState, EBiometryType, BIOMETRY_NONE };
