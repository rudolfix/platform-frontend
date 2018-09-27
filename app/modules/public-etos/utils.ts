import BigNumber from "bignumber.js";
import { ETOStateOnChain, ICalculatedContribution, TEtoStartOfStates, IEtoTotalInvestment } from "./types";

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

export const convertToEtoTotalInvestment = ([totalEquivEurUlps, totalTokensInt, totalInvestors]: [
  BigNumber,
  BigNumber,
  BigNumber
]): IEtoTotalInvestment => ({
  totalEquivEurUlps,
  totalTokensInt,
  totalInvestors,
});

const convertToDate = (startOf: BigNumber): Date | undefined => {
  if (startOf.isZero()) {
    return undefined;
  }

  return new Date(startOf.mul(1000).toNumber());
};

export const convertToStateStartDate = (startOfStates: [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
]): TEtoStartOfStates => {
  const [
    startOfSetup,
    startOfWhitelist,
    startOfPublic,
    startOfSigning,
    startOfClaim,
    startOfPayout,
    startOfRefund,
  ] = startOfStates.map(convertToDate);

  return {
    [ETOStateOnChain.Setup]: startOfSetup,
    [ETOStateOnChain.Whitelist]: startOfWhitelist,
    [ETOStateOnChain.Public]: startOfPublic,
    [ETOStateOnChain.Signing]: startOfSigning,
    [ETOStateOnChain.Claim]: startOfClaim,
    [ETOStateOnChain.Payout]: startOfPayout,
    [ETOStateOnChain.Refund]: startOfRefund,
  };
};
