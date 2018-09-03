import BigNumber from "bignumber.js";

import { TInvestorEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";

const INVESTMENT_GAS_AMOUNT = "600000"
const GAS_PRICE_MULTIPLIER = 1.2

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
  NoWalletSelected = "no_wallet_selected",
  NotEnoughEtherForGas = "not_enough_ether_for_gas"
}

export interface ICalculatedContribution {
  isWhitelisted: boolean
  minTicketEurUlps: BigNumber
  maxTicketEurUlps: BigNumber
  equityTokenInt: BigNumber
  neuRewardUlps: BigNumber
  maxCapExceeded: boolean
}

export interface IInvestmentFlowState {
  euroValueUlps: string,
  investmentType: EInvestmentType
  eto?: TInvestorEtoData
  errorState?: EInvestmentErrorState
  calculatedContribution?: ICalculatedContribution
  gasAmount: string
  gasPrice: string
}

export const investmentFlowInitialState: IInvestmentFlowState = {
  euroValueUlps: "",
  investmentType: EInvestmentType.None,
  gasAmount: INVESTMENT_GAS_AMOUNT,
  gasPrice: ""
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
        investmentType: action.payload.type,
        euroValueUlps: "",
        errorState: undefined,
        calculatedContribution: undefined,
      };
    case "INVESTMENT_FLOW_SET_GAS_PRICE":
      return {
        ...state,
        gasPrice: multiplyBigNumbers([action.payload.gasPrice, GAS_PRICE_MULTIPLIER])
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
        euroValueUlps: action.payload.value
      };
    case "INVESTMENT_FLOW_SET_CALCULATED_CONTRIBUTION":
      return {
        ...state,
        calculatedContribution: action.payload.contrib
      };
  }

  return state;
};
