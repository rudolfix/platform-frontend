import { createSelector } from "reselect";

import { TAppGlobalState } from "../../../../store";

export const selectKycOnfido = (state: TAppGlobalState) => state.kyc.onfido;

export const selectKycOnfidoRequestStartError = createSelector(
  selectKycOnfido,
  onfido => onfido.requestStartError,
);
