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
