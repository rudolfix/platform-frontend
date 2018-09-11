import { createAction, createSimpleAction } from "../actionsUtils";
import { EInvestmentCurrency, EInvestmentErrorState, EInvestmentType } from "./reducer";

export const investmentFlowActions = {
  // public actions
  investmentStart: () => createSimpleAction("INVESTMENT_FLOW_START"),
  investmentReset: () => createSimpleAction("INVESTMENT_FLOW_RESET"),
  selectInvestmentType: (type: EInvestmentType) =>
    createAction("INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE", { type }),
  submitCurrencyValue: (value: string, currency: EInvestmentCurrency) =>
    createAction("INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE", { value, currency }),
  validateInputs: () => createSimpleAction("INVESTMENT_FLOW_VALIDATE_INPUTS"),
  generateInvestmentTx: () => createSimpleAction("INVESTMENT_FLOW_GENERATE_TX"),
  // state mutations
  setEthValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_ETH_VALUE", { value }),
  setEurValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_EUR_VALUE", { value }),
  setGasPrice: (gasPrice?: string) => createAction("INVESTMENT_FLOW_SET_GAS_PRICE", { gasPrice }),
  setErrorState: (errorState?: EInvestmentErrorState) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_ERROR_STATE", { errorState }),
  setIsInputValidated: (isValidated: boolean) =>
    createAction("INVESTMENT_FLOW_SET_IS_INPUT_VALIDATED", { isValidated }),
};
