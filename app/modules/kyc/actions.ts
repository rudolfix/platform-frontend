import { createAction } from "../actions";

import { IKycCompanyData, IKycManualVerificationData, IKycPersonalData } from "../../lib";

export const kycActions = {
  kycSubmitCompanyForm: (data: IKycCompanyData) =>
    createAction("KYC_SUBMIT_COMPANY_FORM", { data }),

  kycSubmitPersonalForm: (data: IKycPersonalData) =>
    createAction("KYC_SUBMIT_PERSONAL_FORM", { data }),

  kycStartPersonalInstantId: () => createAction("KYC_START_PERSONAL_INSTANT_ID", {}),

  kycSubmitManualVerificationForm: (data: IKycManualVerificationData) =>
    createAction("KYC_SUBMIT_MANUAL_VERIFICATION_FORM", { data }),

  kycUploadId: () => createAction("KYC_UPLOAD_ID", {}),
};
