import { createSelector } from "reselect";

import { TAppGlobalState } from "../../../store";

export const selectKycOnfido = (state: TAppGlobalState) => state.instantId.onfido;

export const selectKycOnfidoRequestStartError = createSelector(
  selectKycOnfido,
  onfido => onfido.requestStartError,
);
