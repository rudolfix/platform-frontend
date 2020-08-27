import { biometricsActions } from "modules/biometry/actions";
import { biometricsSagas, initializeBiometrics } from "modules/biometry/sagas";
import {
  selectBiometricsState,
  selectBiometricsType,
  selectIsBiometryAccessRequestRequired,
  selectIsBiometryAvailable,
} from "modules/biometry/selectors";

import { setupBindings } from "./lib/bindings";
import { biometricsReducerMap, EBiometricsState } from "./reducer";
import { EBiometryType, BIOMETRY_NONE, TBiometryNone } from "./types";

const MODULE_ID = "wallet:biometry";

const setupBiometryModule = () => ({
  id: MODULE_ID,
  libs: [setupBindings()],
  sagas: [biometricsSagas],
  reducerMap: biometricsReducerMap,
  api: biometryModuleApi,
});

const biometryModuleApi = {
  actions: biometricsActions,
  sagas: {
    initializeBiometrics,
  },
  selectors: {
    selectBiometricsState,
    selectBiometricsType,
    selectIsBiometryAccessRequestRequired,
    selectIsBiometryAvailable,
  },
};

export type { TBiometryNone };
export { setupBiometryModule, biometryModuleApi, EBiometricsState, EBiometryType, BIOMETRY_NONE };
