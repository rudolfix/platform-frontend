import { ECurrency } from "../../components/shared/formatters/utils";
import { IEtoTokenData, TEtoWithCompanyAndContract } from "../eto/types";

export interface ITokenDisbursal {
  token: ECurrency;
  amountToBeClaimed: string;
  totalDisbursedAmount: string;
  timeToFirstDisbursalRecycle: number;
}

export interface IInvestorTicket {
  equivEurUlps: string;
  rewardNmkUlps: string;
  equityTokenInt: string;
  sharesInt: string;
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

export type TETOWithInvestorTicket = TEtoWithCompanyAndContract & {
  investorTicket: IInvestorTicket;
};

export type TETOWithTokenData = TEtoWithCompanyAndContract & {
  tokenData: IEtoTokenData;
};

export interface IIncomingPayoutsData {
  euroTokenIncomingPayoutValue: string;
  etherTokenIncomingPayoutValue: string;
}

export interface IIncomingPayouts {
  loading: boolean;
  data?: IIncomingPayoutsData;
  payoutDone: boolean;
}

export enum EUserRefundStatus {
  CANNOT_CLAIM = "cannot_claim",
  CAN_CLAIM = "can_claim",
  CLAIMED = "claimed",
}
