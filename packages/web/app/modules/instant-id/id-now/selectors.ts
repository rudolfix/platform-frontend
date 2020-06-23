import { createSelector } from "reselect";

import { TAppGlobalState } from "../../../store";

export const selectKycIdNow = (state: TAppGlobalState) => state.instantId.idNow;

export const selectKycIdNowRedirectUrl = createSelector(selectKycIdNow, idNow => idNow.redirectUrl);
