import { createActionFactory } from "@neufund/shared";
import { EInvestmentInputValidationError, TInvestmentInputError, TTxUserFlowInvestmentReadyState } from "./reducer";

export const txUserFlowInvestmentActions = {
  setData: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_DATA",
    (data:TTxUserFlowInvestmentReadyState)=>({data})
  ),
  submitInvestmentValue:createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SUBMIT_VALUE",
    (value: string) => ({value})
  ),
  setInvestmentValue: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_VALUE",
    (value: string) => ({value})
  ),
  setValidationError: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_VALIDATION_ERROR",
    (error: EInvestmentInputValidationError) => ({error})
  ),
  setResult: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_RESUTL",
    (value: string, error: TInvestmentInputError) => ({value, error})
  ),
};
