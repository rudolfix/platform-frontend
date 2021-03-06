import {
  compareBigNumbers,
  convertFromUlps,
  convertToUlps,
  ECurrency,
  ETH_DECIMALS,
  multiplyBigNumbers,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

import { getTestSettings } from "../../utils";
import { EUserType } from "../auth/module";
import { EETOStateOnChain } from "../eto/types";
import { ETHER_TOKEN_PAYOUT_THRESHOLD, EURO_TOKEN_PAYOUT_THRESHOLD } from "./constants";
import {
  EUserRefundStatus,
  ICalculatedContribution,
  IInvestorTicket,
  ITokenDisbursal,
} from "./types";

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
  boolean,
]): ICalculatedContribution => ({
  isWhitelisted,
  isEligible,
  minTicketEurUlps: minTicketEurUlps.toString(),
  maxTicketEurUlps: maxTicketEurUlps.toString(),
  equityTokenInt: equityTokenInt.toString(),
  neuRewardUlps: neuRewardUlps.toString(),
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
  boolean,
]): IInvestorTicket => ({
  equivEur: convertFromUlps(equivEurUlps).toString(),
  rewardNmkUlps: rewardNmkUlps.toString(),
  equityTokenInt: equityTokenInt.toString(),
  shares: convertFromUlps(sharesInt.toString()).toString(),
  tokenPrice: tokenPrice.toString(),
  neuRate: neuRate.toString(),
  amountEth: amountEth.toString(),
  amountEurUlps: amountEurUlps.toString(),
  claimedOrRefunded,
  usedLockedAccount,
});

export const convertToTokenDisbursal = (
  token: ECurrency,
  [amountToBeClaimed, totalDisbursedAmount, timeToFirstDisbursalRecycle]: BigNumber[],
  etherPrice: string,
): ITokenDisbursal => ({
  token,
  amountToBeClaimed: amountToBeClaimed.toString(),
  totalDisbursedAmount: totalDisbursedAmount.toString(),
  tokenDecimals: ETH_DECIMALS,
  amountEquivEur: convertFromUlps(
    token === ECurrency.ETH
      ? multiplyBigNumbers([amountToBeClaimed.toString(), etherPrice])
      : amountToBeClaimed.toString(),
  ).toString(),
  // convert seconds timestamp to milliseconds
  timeToFirstDisbursalRecycle: timeToFirstDisbursalRecycle.mul("1000").toNumber(),
});

export const convertToWhitelistTicket = ([
  isWhitelisted,
  whitelistDiscountAmountEurUlps,
  fullTokenPriceFrac,
]: [boolean, BigNumber, BigNumber]) => ({
  isWhitelisted,
  whitelistDiscountAmountEurUlps,
  fullTokenPriceFrac,
});

export const getTokenPrice = (equityTokenInt: string, equivEur: string): string => {
  const equivEurBn = new BigNumber(equivEur);
  if (equivEurBn.isZero()) {
    return "0";
  }

  return equivEurBn.div(equityTokenInt).toString();
};

export const getRequiredIncomingAmount = (token: ECurrency) => {
  // In case of Cypress tests we have to return 0 by default to prevent tests with low amounts from crash
  // If there is data stored in window use it
  if (process.env.NF_CYPRESS_RUN === "1") {
    const { payoutRequiredAmount } = getTestSettings();
    return payoutRequiredAmount || "0";
  }

  switch (token) {
    case ECurrency.ETH: {
      return convertToUlps("1");
    }
    case ECurrency.EUR_TOKEN: {
      return convertToUlps("100");
    }
    default:
      return "0";
  }
};

// TODO: Remove dependency on userType
export const getRefundStatus = (
  etoState: EETOStateOnChain,
  userType: EUserType | undefined,
  doesInvestorInvest: boolean,
  investorTicket: IInvestorTicket | undefined,
): EUserRefundStatus => {
  if (
    etoState === EETOStateOnChain.Refund &&
    userType === EUserType.INVESTOR &&
    doesInvestorInvest &&
    investorTicket
  ) {
    if (investorTicket.claimedOrRefunded) {
      return EUserRefundStatus.CLAIMED;
    } else {
      return EUserRefundStatus.CAN_CLAIM;
    }
  } else {
    return EUserRefundStatus.CANNOT_CLAIM;
  }
};

export const snapshotIsActual = (snapshotDate: number, now: Date) => {
  const snapshotInMilliseconds = snapshotDate * 1000;

  const dates: [number, number][] = [
    [new Date(snapshotInMilliseconds).getUTCFullYear(), now.getUTCFullYear()],
    [new Date(snapshotInMilliseconds).getUTCMonth(), now.getUTCMonth()],
    [new Date(snapshotInMilliseconds).getUTCDate(), now.getUTCDate()],
  ];

  return dates.reduce(
    (acc: boolean, pair: [number, number]): boolean => acc && pair[0] === pair[1],
    true,
  );
};

export const getRequiredAmount = (token: ECurrency) => {
  // In case of Cypress tests we have to return 0 by default to prevent tests with low amounts from crash
  // If there is data stored in window use it
  if (process.env.NF_CYPRESS_RUN === "1") {
    const { payoutRequiredAmount } = getTestSettings();
    return payoutRequiredAmount || "0";
  }

  switch (token) {
    case ECurrency.ETH: {
      return convertToUlps(ETHER_TOKEN_PAYOUT_THRESHOLD);
    }
    case ECurrency.EUR_TOKEN: {
      return convertToUlps(EURO_TOKEN_PAYOUT_THRESHOLD);
    }
    default:
      return "0";
  }
};

export const shouldShowToken = (token: ECurrency, amount: string) => {
  const requiredAmount = getRequiredAmount(token);
  return compareBigNumbers(amount, requiredAmount) >= 0;
};
