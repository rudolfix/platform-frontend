import { BigNumber } from "bignumber.js";

import { compareBigNumbers, multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { EInvestmentType, ICalculatedContribution, IInvestmentFlowState } from "./reducer";

export const selectIsICBMInvestment = (state: IInvestmentFlowState) =>
  state.investmentType === EInvestmentType.ICBMEth ||
  state.investmentType === EInvestmentType.ICBMnEuro;

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
