import { AppReducer } from "../../../../store";
import { actions } from "../../../actions";
import { TEtoWithCompanyAndContractReadonly } from "../../../eto/types";
import { EProcessState } from "../../../../utils/enums/processStates";
import { XOR } from "../../../../types";

export type TxUserFlowInvestmentReadyState = {
  eto: TEtoWithCompanyAndContractReadonly,
  investmentType: string,
  equityTokenCount: string,
  ethValue: string,
  euroValue: string,
  gasCostEth: string,
  gasCostEuro: string,
  minTicketEth: string,
  minTicketEur: string,
  maxTicketEur: string,
  neuReward: string,
  readyToInvest: string,
  sendTransaction: string,
  showTokens: string,
  wallets: string,
  hasPreviouslyInvested: boolean,
  investmentCurrency: string,
  etoTokenGeneralDiscounts: string,
  etoTokenPersonalDiscount: string,
  etoTokenStandardPrice: string,
  errorState: string,
  txValidationState: string,
  equityTokenName: string,
}

export type TxUserFlowInvestmentState = XOR<
  { processState: EProcessState.SUCCESS } & TxUserFlowInvestmentReadyState,
  { processState: EProcessState.ERROR | EProcessState.IN_PROGRESS | EProcessState.NOT_STARTED}
  >

const initialState = {processState: EProcessState.NOT_STARTED};

export const txUserFlowInvestmentReducer: AppReducer<TxUserFlowInvestmentState> = (
  state = initialState,
  action,
): TxUserFlowInvestmentState => {
  switch (action.type) {
    case actions.txUserFlowInvestment.setData.getType():{
      return {
        ...state,
        processState: EProcessState.SUCCESS,
        ...action.payload.data
      }
    }
  }

  return state;
};
