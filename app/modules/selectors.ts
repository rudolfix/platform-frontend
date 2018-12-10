import { IAppState } from "../store";
import { selectBackupCodesVerified, selectIsUserEmailVerified } from "./auth/selectors";
import { selectKycRequestStatus } from "./kyc/selectors";

export const SelectIsVerificationFullyDone = (s: IAppState) =>
  !!(
    selectIsUserEmailVerified(s.auth) &&
    selectBackupCodesVerified(s) &&
    selectKycRequestStatus(s) === "Accepted"
  );
