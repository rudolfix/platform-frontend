import {
  TKycRequestType,
  TRequestOutsourcedStatus,
  TRequestStatus,
} from "../../lib/api/KycApi.interfaces";
import { IKycState } from "./reducer";

export const selectKycRequestStatus = (state: IKycState): TRequestStatus | undefined => {
  const requestState =
    state.individualRequestState && state.individualRequestState.status === "Draft"
      ? state.businessRequestState
      : state.individualRequestState;
  if (requestState) return requestState.status;
  return undefined;
};

export const selectKycRequestOutsourcedStatus = (
  state: IKycState,
): TRequestOutsourcedStatus | undefined => {
  const requestState =
    state.individualRequestState && state.individualRequestState.status === "Draft"
      ? state.businessRequestState
      : state.individualRequestState;
  if (requestState) return requestState.outsourcedStatus;
  return undefined;
};

export const selectExternalKycUrl = (state: IKycState): string | undefined => {
  const requestState =
    state.individualRequestState && state.individualRequestState.status === "Draft"
      ? state.businessRequestState
      : state.individualRequestState;
  if (requestState) return requestState.redirectUrl;
  return undefined;
};

export const selectPendingKycRequestType = (state: IKycState): TKycRequestType | undefined => {
  if (state.individualRequestState && state.individualRequestState.status === "Pending")
    return "individual";
  if (state.businessRequestState && state.businessRequestState.status === "Pending")
    return "business";
  return undefined;
};

export const selectKycOutSourcedURL = (state: IKycState): string => {
  if (state.individualRequestState && state.individualRequestState.redirectUrl)
    return state.individualRequestState.redirectUrl;
  return "";
};

export const selectCombinedBeneficialOwnerOwnership = (state: IKycState): number => {
  if (state.beneficialOwners.length === 0) return 0;
  return state.beneficialOwners.reduce(
    (all, owner) => all + (owner.ownership ? owner.ownership : 0),
    0,
  );
};

export const selectWidgetLoading = (state: IKycState): boolean =>
  !!state.individualRequestStateLoading || !!state.businessRequestStateLoading;

export const selectWidgetError = (state: IKycState): string | undefined =>
  state.individualRequestError || state.businessRequestError;
