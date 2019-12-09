import { createActionFactory } from "@neufund/shared";
import {
  TTxUserFlowInvestmentViewData
} from "./reducer";
import { ETxSenderType, TAdditionalDataByType } from "../../types";
import { EInvestmentType } from "../../../investment-flow/reducer";

export const txUserFlowInvestmentActions = {
  setEtoId: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_ETO_ID",
    (etoId:string)=>({etoId})
  ),
  setViewData: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_VIEW_DATA",
    (data:TTxUserFlowInvestmentViewData)=>({data})
  ),
  reset: createActionFactory("TX_USER_FLOW_INVESTMENT_RESET"  ),
  submitInvestmentValue:createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SUBMIT_VALUE",
    (value: string) => ({value})
  ),
  setInvestmentValue: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_VALUE",
    (value: string) => ({value})
  ),
  setFormStateValidating: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_FORM_STATE_VALIDATING",
  ),
  updateValue: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_UPDATE_VALUE",
    (value: string) => ({value})
  ),
  investEntireBalance: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_INVEST_ENTIRE_BALANCE",
  ),
  submitInvestment: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SUBMIT_INVESTMENT",
  ),
  submitTransaction: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SUBMIT_TRANSACTION",
    (transactionData:TAdditionalDataByType<ETxSenderType.INVEST>)=>({transactionData})
  ),
  setInvestmentType: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_INVESTMENT_TYPE",
    (investmentType:EInvestmentType)=>({investmentType})
  ),
  startInvestment: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_START_INVESTMENT",
    (etoId:string)=>({etoId})
  ),
};
