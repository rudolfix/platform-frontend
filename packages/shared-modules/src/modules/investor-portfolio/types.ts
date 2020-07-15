import { ECurrency } from "@neufund/shared-utils";

import { IEtoTokenData, TEtoWithCompanyAndContractReadonly } from "../eto/types";

export interface ITokenDisbursal {
  token: ECurrency;
  amountToBeClaimed: string;
  totalDisbursedAmount: string;
  timeToFirstDisbursalRecycle: number;
  tokenDecimals: number;
  amountEquivEur: string;
}

export type TTokenDisbursalData = {
  loading: boolean;
  error: boolean;
  data: ITokenDisbursal[] | undefined;
};

export interface IInvestorTicket {
  equivEur: string;
  rewardNmkUlps: string;
  equityTokenInt: string;
  shares: string;
  tokenPrice: string;
  neuRate: string;
  amountEth: string;
  amountEurUlps: string;
  claimedOrRefunded: boolean;
  usedLockedAccount: boolean;
}

export interface ICalculatedContribution {
  isWhitelisted: boolean;
  isEligible: boolean;
  minTicketEurUlps: string;
  maxTicketEurUlps: string;
  equityTokenInt: string;
  neuRewardUlps: string;
  maxCapExceeded: boolean;
}

export interface IWhitelistTicket {
  whitelistDiscountAmountEur: string;
  whitelistDiscount: string;
}

export type TTokensPersonalDiscount = IWhitelistTicket & {
  discountedTokenPrice: string;
};

export interface IPersonalDiscount {
  whitelistDiscountAmountLeft: string;
  discountedTokenPrice: string;
  whitelistDiscount: string;
}

export type TETOWithInvestorTicket = TEtoWithCompanyAndContractReadonly & {
  investorTicket: IInvestorTicket;
};

export type TETOWithTokenData = TEtoWithCompanyAndContractReadonly & {
  tokenData: IEtoTokenData;
};

export interface IIncomingPayoutsData {
  euroTokenIncomingPayoutValue: string;
  etherTokenIncomingPayoutValue: string;
  snapshotDate: number; //posix timestamp
}

export interface IIncomingPayouts {
  loading: boolean;
  error: boolean;
  data?: IIncomingPayoutsData;
}

export enum EUserRefundStatus {
  CANNOT_CLAIM = "cannot_claim",
  CAN_CLAIM = "can_claim",
  CLAIMED = "claimed",
}
