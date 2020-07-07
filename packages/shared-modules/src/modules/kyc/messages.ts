export enum KycFlowMessage {
  KYC_PROBLEM_SAVING_DATA = "kycProblemSavingData",
  KYC_PROBLEM_SENDING_DATA = "kycProblemSendingData",
  KYC_UPLOAD_SUCCESSFUL = "kycUploadSuccessful",
  KYC_UPLOAD_FAILED = "kycUploadFailed",
  KYC_SUBMIT_FAILED = "kycSubmitFailed",
  KYC_SUBMIT_TITLE = "kycSubmitTitle",
  KYC_SUBMIT_DESCRIPTION = "kycSubmitDescription",
  KYC_SETTINGS_BUTTON = "kycSettingsButton",
  KYC_ERROR = "kycError",
  KYC_BENEFICIAL_OWNERS = "kycBeneficialOwners",
  KYC_PROBLEM_LOADING_BANK_DETAILS = "kycProblemLoadingBankDetails",
}

export enum EKycRequestStatusTranslation {
  DRAFT = "KycRequestStatusTranslationDraft",
  PENDING = "KycRequestStatusTranslationPending",
  OUTSOURCED = "KycRequestStatusTranslationOutsourced",
  REJECTED = "KycRequestStatusTranslationRejected",
  ACCEPTED = "KycRequestStatusTranslationAccepted",
  IGNORED = "KycRequestStatusTranslationIgnored",
}
