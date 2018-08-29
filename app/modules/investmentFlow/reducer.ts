import { TInvestorEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { divideBigNumbers } from "../../utils/BigNumberUtils";
import { extractNumber } from "../../utils/StringUtils";

export enum EInvestmentType {
  None = "NONE",
  InvestmentWallet = "INVESTMENT_WALLET",
  ICBMEth = "ICBM_ETH",
  ICBMnEuro = "ICBM_NEURO",
  BankTransfer = "BANK_TRANSFER"
}

export enum EInvestmentErrorState {
  AboveMaximumTicketSize = "above_maximum_ticket_size",
  BelowMinimumTicketSize = "below_minimum_ticket_size",
  ExceedsWalletBalance = "exceeds_wallet_balance",
  ExceedsTokenAmount = "exceeds_token_amount",
}

export interface IInvestmentFlowState {
  euroValue: string,
  investmentType: EInvestmentType
  eto?: TInvestorEtoData
  errorState?: EInvestmentErrorState
}

export const investmentFlowInitialState: IInvestmentFlowState = {
  euroValue: "",
  investmentType: EInvestmentType.None
};

export const investmentFlowReducer: AppReducer<IInvestmentFlowState> = (
  state = investmentFlowInitialState,
  action,
): DeepReadonly<IInvestmentFlowState> => {
  switch (action.type) {
    case "INVESTMENT_FLOW_RESET":
      return {
        ...investmentFlowInitialState
      }
    case "INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE":
      return {
        ...state,
        investmentType: action.payload.type
      };
    case "INVESTMENT_FLOW_SET_ETO":
      return {
        ...state,
        eto: action.payload.eto
      };
    case "INVESTMENT_FLOW_SET_INVESTMENT_ERROR_STATE":
      return {
        ...state,
        errorState: action.payload.errorState
      };
    case "INVESTMENT_FLOW_SET_INVESTMENT_EUR_VALUE":
      return {
        ...state,
        euroValue: extractNumber(action.payload.value)
      };
  }

  return state;
};
