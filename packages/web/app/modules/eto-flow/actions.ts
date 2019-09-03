import { createActionFactory } from "@neufund/shared";

import {
  TCompanyEtoData,
  TEtoSpecsData,
  TGeneralEtoData,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TEtoProducts } from "../../lib/api/eto/EtoProductsApi.interfaces";

export const etoFlowActions = {
  loadIssuerEto: createActionFactory("ETO_FLOW_LOAD_ISSUER_ETO"),
  loadDataStart: createActionFactory("ETO_FLOW_LOAD_DATA_START"),
  loadDataStop: createActionFactory("ETO_FLOW_LOAD_DATA_STOP"),
  loadProducts: createActionFactory("ETO_FLOW_LOAD_PRODUCTS"),
  setProducts: createActionFactory("ETO_FLOW_SET_PRODUCTS", (products: TEtoProducts) => ({
    products,
  })),
  changeProductType: createActionFactory("ETO_FLOW_CHANGE_PRODUCT", (productId: string) => ({
    productId,
  })),
  uploadStartDate: createActionFactory("ETO_FLOW_START_DATE_TX"),
  cleanupStartDate: createActionFactory("ETO_FLOW_CLEANUP_START_DATE_TX"),
  submitDataStart: createActionFactory("ETO_FLOW_SUBMIT_DATA_START"),
  publishDataStart: createActionFactory("ETO_FLOW_PUBLISH_DATA_START"),
  setEto: createActionFactory(
    "ETO_FLOW_SET_ETO",
    ({ eto, company }: { eto: TEtoSpecsData; company?: TCompanyEtoData }) => ({ eto, company }),
  ),
  saveDataStart: createActionFactory(
    "ETO_FLOW_SAVE_DATA_START",
    (data: Partial<TGeneralEtoData>) => ({ data }),
  ),
  changeBookBuildingStatus: createActionFactory(
    "ETO_FLOW_CHANGE_BOOK_BUILDING_STATES",
    (status: boolean) => ({ status }),
  ),
  downloadBookBuildingStats: createActionFactory("ETO_FLOW_DOWNLOAD_BOOK_BUILDING_STATS"),
  setNewStartDate: createActionFactory("ETO_FLOW_SET_START_DATE", (newStartDate: Date) => ({
    newStartDate,
  })),
  clearNewStartDate: createActionFactory("ETO_FLOW_CLEAR_START_DATE", () => ({
    newStartDate: undefined,
  })),
  loadSignedInvestmentAgreement: createActionFactory(
    "ETO_FLOW_LOAD_INVESTMENT_AGREEMENT",
    (etoId: string) => ({ etoId }),
  ),
  setInvestmentAgreementHash: createActionFactory(
    "ETO_FLOW_SET_INVESTMENT_AGREEMENT_URL",
    (signedInvestmentAgreementUrl: string | null) => ({ signedInvestmentAgreementUrl }),
  ),
  signInvestmentAgreement: createActionFactory(
    "ETO_FLOW_SIGN_INVESTMENT_AGREEMENT",
    (etoId: string, agreementHash: string) => ({ etoId, agreementHash }),
  ),
  setEtoDateStart: createActionFactory("ETO_FLOW_SET_ETO_DATE_START"),
  setEtoDateStop: createActionFactory("ETO_FLOW_SET_ETO_DATE_STOP"),
};