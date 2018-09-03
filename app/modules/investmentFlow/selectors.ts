import { BigNumber } from "bignumber.js";

import { multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { EInvestmentType, ICalculatedContribution, IInvestmentFlowState } from "./reducer";

export const selectIsICBMInvestment = (state: IInvestmentFlowState) => state.investmentType === EInvestmentType.ICBMEth || state.investmentType === EInvestmentType.ICBMnEuro

export const convertToCalculatedContribution = ([
  isWhitelisted,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded
]: [boolean, BigNumber, BigNumber, BigNumber, BigNumber, boolean]): ICalculatedContribution => ({
  isWhitelisted,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded
})

export const selectInvestmentGasCost = (state: IInvestmentFlowState) => multiplyBigNumbers([state.gasPrice, state.gasAmount])
