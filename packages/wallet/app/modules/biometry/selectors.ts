import { StateFromReducersMapObject } from "redux";
import { createSelector } from "reselect";

import { biometricsReducerMap } from "./reducer";

const selectBiometrics = (state: StateFromReducersMapObject<typeof biometricsReducerMap>) =>
  state.biometrics;

const selectBiometricsState = createSelector(selectBiometrics, biometrics => biometrics.state);

const selectBiometricsType = createSelector(selectBiometrics, biometrics => biometrics.type);

export { selectBiometricsState, selectBiometricsType };
