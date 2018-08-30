import { BigNumber } from "bignumber.js";

import { EInvestmentType, ICalculatedContribution, IInvestmentFlowState } from "./reducer";

export const selectInvestmentModalOpened = (state: IInvestmentFlowState) => !!state.eto

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
