import { createAction } from "../actions";

export const kycActions = {
  kycSubmitCompanyForm: () => createAction("KYC_SUBMIT_COMPANY_FORM", {}),

  kycSubmitPersonalForm: () => createAction("KYC_SUBMIT_PERSONAL_FORM", {}),

  kycStartPersonalInstantId: () => createAction("KYC_START_PERSONAL_INSTANT_ID", {}),

  kycSubmitManualVerificationForm: () => createAction("KYC_SUBMIT_MANUAL_VERIFICATION_FORM", {}),

  kycUploadId: () => createAction("KYC_UPLOAD_ID", {}),
};
