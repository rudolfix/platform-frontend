import {
  TPublicEtoData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { DeepReadonlyObject } from "../../types";
import BigNumber from "bignumber.js";

export interface ICalculatedContribution {
  isWhitelisted: boolean;
  minTicketEurUlps: BigNumber;
  maxTicketEurUlps: BigNumber;
  equityTokenInt: BigNumber;
  neuRewardUlps: BigNumber;
  maxCapExceeded: boolean;
}

export interface IEtoTotalInvestment {
  totalEquivEurUlps: BigNumber;
  totalTokensInt: BigNumber;
  totalInvestors: BigNumber;
}

export enum ETOStateOnChain {
  Setup = 0, // Initial state
  Whitelist = 1,
  Public = 2,
  Signing = 3,
  Claim = 4,
  Payout = 5, // Terminal state
  Refund = 6, // Terminal state
}

export interface IEtoContractData {
  timedState?: ETOStateOnChain;
  totalInvestment: IEtoTotalInvestment;
}

export type TEtoWithContract = TPublicEtoData & DeepReadonlyObject<{ contract?: IEtoContractData; }>;
