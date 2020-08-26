import { StateFromReducersMapObject } from "redux";
import { createSelector } from "reselect";

import { biometricsReducerMap, EBiometricsState } from "./reducer";

const selectBiometrics = (state: StateFromReducersMapObject<typeof biometricsReducerMap>) =>
  state.biometrics;

const selectBiometricsState = createSelector(selectBiometrics, biometrics => biometrics.state);

const selectBiometricsType = createSelector(selectBiometrics, biometrics => biometrics.type);

const selectIsBiometryAccessRequestRequired = createSelector(
  selectBiometrics,
  biometrics => biometrics.state === EBiometricsState.ACCESS_REQUEST_REQUIRED,
);

export { selectBiometricsState, selectBiometricsType, selectIsBiometryAccessRequestRequired };
