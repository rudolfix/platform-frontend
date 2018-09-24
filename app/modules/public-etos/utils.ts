import BigNumber from "bignumber.js";
import { ICalculatedContribution } from "./reducer";

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
