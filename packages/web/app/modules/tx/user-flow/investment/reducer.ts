import { AppReducer } from "../../../../store";
import { actions } from "../../../actions";
import { TEtoWithCompanyAndContractReadonly } from "../../../eto/types";
import { EProcessState } from "../../../../utils/enums/processStates";
import { DeepReadonly, XOR } from "../../../../types";
import { EInvestmentCurrency } from "../../../../components/modals/tx-sender/investment-flow/utils";
import { WalletSelectionData } from "../../../../components/modals/tx-sender/investment-flow/InvestmentTypeSelector";
import { EInvestmentErrorState, EInvestmentType } from "../../../investment-flow/reducer";
import { EValidationState } from "../../validator/reducer";

export type TTxUserFlowInvestmentReadyState = {
  eto: TEtoWithCompanyAndContractReadonly,
  investmentValue: string,
  equityTokenCount: string,
  gasCostEth: string,
  gasCostEuro: string,
  investmentType: EInvestmentType,
  minTicketEur: string,
  maxTicketEur: string,
  neuReward: string,
  readyToInvest: string,
  showTokens: boolean,
  wallets: DeepReadonly<WalletSelectionData[]>,
  hasPreviouslyInvested: boolean,
  investmentCurrency: EInvestmentCurrency,
  etoTokenGeneralDiscounts: string,
  etoTokenPersonalDiscount: string,
  etoTokenStandardPrice: string,
  error: TInvestmentInputError | undefined,
  totalCostEth:string,
  totalCostEuro: string,
  minEthTicketFormatted: string,
  equityTokenCountFormatted: string,
  euroValueWithFallback: string,
}

export enum EInvestmentInputValidationError {
  INPUT_VALIDATION_ERROR = "inputValidationError",
}

export type TInvestmentInputError = EInvestmentErrorState & EInvestmentInputValidationError

export type TxUserFlowInvestmentState = XOR<
  { processState: EProcessState.NOT_STARTED | EProcessState.ERROR | EProcessState.IN_PROGRESS },
  ({ processState: EProcessState.SUCCESS } & TTxUserFlowInvestmentReadyState)
  >

const initialState:TxUserFlowInvestmentState = {processState: EProcessState.NOT_STARTED};

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
    case actions.txUserFlowInvestment.setInvestmentValue.getType(): {
      return state.processState === EProcessState.SUCCESS
      ? {
        ...state,
        investmentValue: action.payload.value
      }
      : state
    }
    case actions.txUserFlowInvestment.setValidationError.getType():{
      console.log("setValidationError", action.payload.error)
      return state.processState === EProcessState.SUCCESS
        ? {
          ...state,
          error: action.payload.error
        }
        : state
    }
  }

  return state;
};
