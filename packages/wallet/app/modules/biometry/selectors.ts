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

const selectIsBiometryAvailable = createSelector(selectBiometrics, biometrics =>
  [EBiometricsState.ACCESS_REQUEST_REQUIRED, EBiometricsState.ACCESS_ALLOWED].includes(
    biometrics.state,
  ),
);

export {
  selectBiometricsState,
  selectBiometricsType,
  selectIsBiometryAccessRequestRequired,
  selectIsBiometryAvailable,
};
