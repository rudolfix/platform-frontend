import { TInvestorEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";
import { EInvestmentErrorState, EInvestmentType, ICalculatedContribution } from "./reducer";

export const investmentFlowActions = {
  selectInvestmentType: (type: EInvestmentType) =>
    createAction("INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE", { type }),
  submitEuroValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SUBMIT_INVESTMENT_EUR_VALUE", { value }),
  submitEthValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SUBMIT_INVESTMENT_ETH_VALUE", { value }),
  investmentStart: (eto: TInvestorEtoData) =>
    createAction("INVESTMENT_FLOW_START", { eto }),
  investmentReset: () =>
    createSimpleAction("INVESTMENT_FLOW_RESET"),
  calculateContribution: () =>
    createSimpleAction("INVESTMENT_FLOW_CALCULATE_CONTRIBUTION"),
  setEuroValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_EUR_VALUE", { value }),
  setCalculatedContribution: (contrib?: ICalculatedContribution) =>
    createAction("INVESTMENT_FLOW_SET_CALCULATED_CONTRIBUTION", { contrib }),
  setEto: (eto: TInvestorEtoData) =>
    createAction("INVESTMENT_FLOW_SET_ETO", { eto }),
  setErrorState: (errorState?: EInvestmentErrorState) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_ERROR_STATE", { errorState }),
};
