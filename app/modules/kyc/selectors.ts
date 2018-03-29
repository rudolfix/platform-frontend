import { TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { IKycState } from "./reducer";

export const selectKycRequestStatuts = (state: IKycState): TRequestStatus | undefined => {
  const requstState =
    state.individualRequestState && state.individualRequestState.status === "Draft"
      ? state.businessRequestState
      : state.individualRequestState;
  if (requstState) return requstState.status;
  return undefined;
};

export const selectKycOutourcedURL = (state: IKycState): string => {
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
