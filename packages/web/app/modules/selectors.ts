import { EKycRequestStatus } from "../lib/api/kyc/KycApi.interfaces";
import { TAppGlobalState } from "../store";
import { selectBackupCodesVerified, selectIsUserEmailVerified } from "./auth/selectors";
import { selectKycRequestStatus } from "./kyc/selectors";

/*
 * @deprecated, please use selectIsUserFullyVerified
 * (packages/web/app/modules/auth/selectors.ts)
 * */
export const selectIsVerificationFullyDone = (state: TAppGlobalState) =>
  !!(
    selectIsUserEmailVerified(state) &&
    selectBackupCodesVerified(state) &&
    selectKycRequestStatus(state) === EKycRequestStatus.ACCEPTED
  );
