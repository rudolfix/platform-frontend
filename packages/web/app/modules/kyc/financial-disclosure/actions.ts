import { createActionFactory } from "@neufund/shared";

import { IKycIndividualData } from "../../../lib/api/kyc/KycApi.interfaces";

export const kycFinancialDisclosureActions = {
  kycSubmitFinancialDisclosure: createActionFactory(
    "KYC_SUBMIT_FINANCIAL_DISCLOSURE",
    (data: IKycIndividualData, close?: boolean) => ({ data, close }),
  ),
};
