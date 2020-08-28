import { AppReducer } from "@neufund/sagas";

import { biometricsActions } from "./actions";
import { EBiometricsType, TBiometricsNone } from "./types";

export enum EBiometricsState {
  UNKNOWN = "unknown",
  NO_SUPPORT = "no_biometrics_support",
  NO_ACCESS = "no_biometrics_access",
  ACCESS_REQUEST_REQUIRED = "access_request_required",
  ACCESS_ALLOWED = "access_allowed",
}

interface IBiometricsState {
  state: EBiometricsState;
  type: undefined | EBiometricsType | TBiometricsNone;
}

const initialState: IBiometricsState = {
  state: EBiometricsState.UNKNOWN,
  type: undefined,
};

const biometricsReducer: AppReducer<IBiometricsState, typeof biometricsActions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case biometricsActions.noBiometricsSupport.getType():
      return {
        ...initialState,
        type: action.payload.type,
        state: EBiometricsState.NO_SUPPORT,
      };

    case biometricsActions.noBiometricsAccess.getType():
      return {
        ...initialState,
        type: action.payload.type,
        state: EBiometricsState.NO_ACCESS,
      };

    case biometricsActions.biometricsAccessRequestRequired.getType():
      return {
        ...initialState,
        type: action.payload.type,
        state: EBiometricsState.ACCESS_REQUEST_REQUIRED,
      };

    case biometricsActions.biometricsAccessAllowed.getType():
      return {
        ...initialState,
        type: action.payload.type,
        state: EBiometricsState.ACCESS_ALLOWED,
      };

    default:
      return state;
  }
};

const biometricsReducerMap = {
  biometrics: biometricsReducer,
};

export { biometricsReducerMap };
