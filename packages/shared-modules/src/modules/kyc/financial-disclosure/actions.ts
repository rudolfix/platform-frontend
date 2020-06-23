import { createActionFactory } from "@neufund/shared-utils";

import { IKycIndividualData } from "../lib/http/kyc-api/KycApi.interfaces";

export const kycFinancialDisclosureActions = {
  kycSubmitFinancialDisclosure: createActionFactory(
    "KYC_SUBMIT_FINANCIAL_DISCLOSURE",
    (data: IKycIndividualData, close?: boolean) => ({ data, close }),
  ),
};
