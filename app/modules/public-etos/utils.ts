import BigNumber from "bignumber.js";
import { ICalculatedContribution, IEtoTotalInvestment } from "./types";

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

export const convertToEtoTotalInvestment = ([
  totalEquivEurUlps,
  totalTokensInt,
  totalInvestors
]: [BigNumber, BigNumber, BigNumber]): IEtoTotalInvestment => ({
  totalEquivEurUlps,
  totalTokensInt,
  totalInvestors
});
