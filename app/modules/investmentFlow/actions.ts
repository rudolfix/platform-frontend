import { TInvestorEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";
import { EInvestmentErrorState, EInvestmentType } from "./reducer";

export const investmentFlowActions = {
  selectInvestmentType: (type: EInvestmentType) =>
    createAction("INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE", { type }),
  setErrorState: (errorState?: EInvestmentErrorState) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_ERROR_STATE", { errorState }),
  setEuroValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_EUR_VALUE", { value }),
  setEthValue: (value: string) =>
    createAction("INVESTMENT_FLOW_SET_INVESTMENT_ETH_VALUE", { value }),
  setEto: (eto: TInvestorEtoData) =>
    createAction("INVESTMENT_FLOW_SET_ETO", { eto }),
  investmentStart: (eto: TInvestorEtoData) =>
    createAction("INVESTMENT_FLOW_START", { eto }),
  investmentReset: () =>
    createSimpleAction("INVESTMENT_FLOW_RESET"),
};
