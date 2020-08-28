import { biometricsActions } from "modules/biometrics/actions";
import { biometricsSagas, initializeBiometrics } from "modules/biometrics/sagas";
import {
  selectBiometricsState,
  selectBiometricsType,
  selectIsBiometricsAccessRequestRequired,
  selectIsBiometricsAvailable,
} from "modules/biometrics/selectors";

import { setupBindings } from "./lib/bindings";
import { biometricsReducerMap, EBiometricsState } from "./reducer";
import { EBiometricsType, BIOMETRICS_NONE, TBiometricsNone } from "./types";

const MODULE_ID = "wallet:biometrics";

const setupBiometricsModule = () => ({
  id: MODULE_ID,
  libs: [setupBindings()],
  sagas: [biometricsSagas],
  reducerMap: biometricsReducerMap,
  api: biometricsModuleApi,
});

const biometricsModuleApi = {
  actions: biometricsActions,
  sagas: {
    initializeBiometrics,
  },
  selectors: {
    selectBiometricsState,
    selectBiometricsType,
    selectIsBiometricsAccessRequestRequired,
    selectIsBiometricsAvailable,
  },
};

export type { TBiometricsNone };
export {
  setupBiometricsModule,
  biometricsModuleApi,
  EBiometricsState,
  EBiometricsType,
  BIOMETRICS_NONE,
};
