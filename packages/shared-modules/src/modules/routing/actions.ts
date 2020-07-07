import { createActionFactory } from "@neufund/shared-utils";

// routing must be implemented in web and wallet project respectively
export const routingActions = {
  // default routes
  goToDashboard: createActionFactory("GOTO_DASHBOARD"),
  goHome: createActionFactory("GO_HOME"),
  goBack: createActionFactory("GO_BACK"),

  // kyc routes
  goToKYCIndividualAddress: createActionFactory("GOTO_KYC_INDIVIDUAL_ADDRESS"),
  goToKYCIndividualFinancialDisclosure: createActionFactory(
    "GOTO_KYC_INDIVIDUAL_FINANCIAL_DISCLOSURE",
  ),
  goToKYCSuccess: createActionFactory("GOTO_KYC_SUCCESS"),
  goToKYCBusinessData: createActionFactory("GOTO_KYC_BUSINESS_DATA"),
  goToKYCManagingDirectors: createActionFactory("GOTO_KYC_MANAGING_DIRECTORS"),
  goToKYCIndividualDocumentVerification: createActionFactory(
    "GOTO_KYC_INDIVIDUAL_DOCUMENT_VERIFICATION",
  ),
};
