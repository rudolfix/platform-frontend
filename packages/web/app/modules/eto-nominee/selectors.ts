import { TAppGlobalState } from "../../store";
import { nomineeRequestsToArray } from "../nominee-flow/utils";

export const selectNomineeRequests = (state: TAppGlobalState) =>
  nomineeRequestsToArray(state.etoNominee.nomineeRequests);

export const selectEtoNomineeIsLoading = (state: TAppGlobalState): boolean =>
  state.etoNominee.isLoading;
