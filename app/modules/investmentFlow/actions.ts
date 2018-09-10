import { TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";
import {
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
  ICalculatedContribution,
} from "./reducer";

export const investmentFlowActions = {
  selectInvestmentType: (type: EInvestmentType) =>
    createAction("INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE", { type }),
  submitCurrencyValue: (value: string, currency: EInvestmentCurrency) =>
    createAction("INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE", { value, currency }),
  investmentStart: (eto: TPublicEtoData) => createAction("INVESTMENT_FLOW_START", { eto }),
  investmentReset: () => createSimpleAction("INVESTMENT_FLOW_RESET"),
  validateInputs: () => createSimpleAction("INVESTMENT_FLOW_VALIDATE_INPUTS"),
  setEthValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_ETH_VALUE", { value }),
  setEurValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_EUR_VALUE", { value }),
  setCalculatedContribution: (contrib?: ICalculatedContribution) =>
    createAction("INVESTMENT_FLOW_SET_CALCULATED_CONTRIBUTION", { contrib }),
  setGasPrice: (gasPrice?: string) => createAction("INVESTMENT_FLOW_SET_GAS_PRICE", { gasPrice }),
  setEto: (eto: TPublicEtoData) => createAction("INVESTMENT_FLOW_SET_ETO", { eto }),
  setErrorState: (errorState?: EInvestmentErrorState) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_ERROR_STATE", { errorState }),
  generateInvestmentTx: () => createSimpleAction("INVESTMENT_FLOW_GENERATE_TX"),
};
