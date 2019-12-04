import { createActionFactory } from "../../../../../../shared/src/modules/actionsUtils";
import { TxUserFlowInvestmentReadyState } from "./reducer";

export const txUserFlowInvestmentActions = {
  setData: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_DATA",
    (data:TxUserFlowInvestmentReadyState)=>({data})
  )
}
