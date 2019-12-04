import { txUserFlowWRedeemReducer } from "./redeem/reducer";
import { txUserFlowTransferReducer } from "./transfer/reducer";
import { txUserFlowInvestmentReducer } from "./investment/reducer";

export const txUserFlowReducers = {
  txUserFlowTransfer: txUserFlowTransferReducer,
  txUserFlowRedeem: txUserFlowWRedeemReducer,
  txUserFlowInvestment: txUserFlowInvestmentReducer
};
