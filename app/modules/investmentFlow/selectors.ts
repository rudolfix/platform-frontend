import { BigNumber } from "bignumber.js";

import { compareBigNumbers, multiplyBigNumbers } from "../../utils/BigNumberUtils";
import {
  EInvestmentCurrency,
  EInvestmentType,
  ICalculatedContribution,
  IInvestmentFlowState,
} from "./reducer";

// State Selectors

export const selectEthValueUlps = (state: IInvestmentFlowState) => state.ethValueUlps;

export const selectEurValueUlps = (state: IInvestmentFlowState) => state.euroValueUlps;

export const selectErrorState = (state: IInvestmentFlowState) => state.errorState;

export const selectInvestmentType = (state: IInvestmentFlowState) => state.investmentType;

export const selectEquityTokenCount = (state: IInvestmentFlowState) =>
  state.calculatedContribution && state.calculatedContribution.equityTokenInt.toString();

export const selectNeuRewardUlps = (state: IInvestmentFlowState) =>
  state.calculatedContribution && state.calculatedContribution.neuRewardUlps.toString();

export const selectEto = (state: IInvestmentFlowState) => state.eto;

export const selectEtoCompany = (state: IInvestmentFlowState) => state.eto && state.eto.company;

// Derived Values

export const selectIsICBMInvestment = (state: IInvestmentFlowState) =>
  state.investmentType === EInvestmentType.ICBMEth ||
  state.investmentType === EInvestmentType.ICBMnEuro;

export const selectInvestmentGasCostEth = (state: IInvestmentFlowState) =>
  multiplyBigNumbers([state.gasPrice, state.gasAmount]);

export const selectReadyToInvest = (state: IInvestmentFlowState) =>
  !!(
    state.euroValueUlps &&
    compareBigNumbers(state.euroValueUlps, 0) > 0 &&
    state.gasPrice &&
    compareBigNumbers(state.gasPrice, 0) > 0 &&
    state.calculatedContribution &&
    !state.errorState
  );

export const selectCurrencyByInvestmentType = (state: IInvestmentFlowState) =>
  state.investmentType === EInvestmentType.InvestmentWallet ||
  state.investmentType === EInvestmentType.ICBMEth
    ? EInvestmentCurrency.Ether
    : EInvestmentCurrency.Euro;

// Helpers

export const convertToCalculatedContribution = ([
  isWhitelisted,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
]: [boolean, BigNumber, BigNumber, BigNumber, BigNumber, boolean]): ICalculatedContribution => ({
  isWhitelisted,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
});
