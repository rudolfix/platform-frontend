import { INomineeRequest } from "../../../../../modules/nominee-flow/reducer";

export const nomineeRequestsAreEmpty = (nomineeRequests: INomineeRequest[]): boolean =>
  nomineeRequests.length === 0;
