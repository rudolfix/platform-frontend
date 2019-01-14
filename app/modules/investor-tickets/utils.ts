import BigNumber from "bignumber.js";

import { Q18 } from "../../config/constants";
import { ICalculatedContribution, IInvestorTicket } from "./types";

export const convertToCalculatedContribution = ([
  isWhitelisted,
  isEligible,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
]: [
  boolean,
  boolean,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean
]): ICalculatedContribution => ({
  isWhitelisted,
  isEligible,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
});

export const convertToInvestorTicket = ([
  equivEurUlps,
  rewardNmkUlps,
  equityTokenInt,
  sharesInt,
  tokenPrice,
  neuRate,
  amountEth,
  amountEurUlps,
  claimedOrRefunded,
  usedLockedAccount,
]: [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean,
  boolean
]): IInvestorTicket => ({
  equivEurUlps,
  rewardNmkUlps,
  equityTokenInt,
  sharesInt,
  tokenPrice,
  neuRate,
  amountEth,
  amountEurUlps,
  claimedOrRefunded,
  usedLockedAccount,
});

export const getNeuReward = (equityTokenInt: BigNumber, equivEurUlps: BigNumber): string => {
  if (equivEurUlps.isZero()) {
    return "0";
  }

  const equityToken = Q18.mul(equityTokenInt);
  return equivEurUlps.div(equityToken).toFixed(8);
};
