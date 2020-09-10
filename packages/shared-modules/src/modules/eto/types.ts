import { DeepReadonly, Dictionary } from "@neufund/shared-utils";

import { TCompanyEtoData, TEtoSpecsData } from "./lib/http/eto-api/EtoApi.interfaces";

export enum EAgreementType {
  RAAA = "raaa",
  THA = "tha",
  ISHA = "isha",
}

export interface IEtoTotalInvestment {
  totalEquivEur: string;
  totalTokensInt: string;
  totalInvestors: string;
  euroTokenBalance: string;
  etherTokenBalance: string;
}

export enum ENomineeUpdateRequestStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum EEtoFormTypes {
  CompanyInformation = "companyInformation",
  LegalInformation = "legalInformation",
  KeyIndividuals = "keyIndividuals",
  ProductVision = "productVision",
  EtoTerms = "etoTerms",
  EtoInvestmentTerms = "etoInvestmentTerms",
  EtoMedia = "etoMedia",
  EtoVotingRights = "etoVotingRights",
  EtoEquityTokenInfo = "etoEquityTokenInfo",
  EtoRiskAssessment = "etoRiskAssessment",
}

// Order is important. Next state is calculated by adding 1 to current state.
export enum EETOStateOnChain {
  Setup = 0, // Initial state
  Whitelist = 1,
  Public = 2,
  Signing = 3,
  Claim = 4,
  Payout = 5, // Terminal state
  Refund = 6, // Terminal state
}

export type TEtoStartOfStates = Record<EETOStateOnChain, Date | undefined>;

export type TEtoContractData = {
  timedState: EETOStateOnChain;
  totalInvestment: IEtoTotalInvestment;
  startOfStates: TEtoStartOfStates;
  equityTokenAddress: string;
  etoTermsAddress: string;
};

export type TEtoWithContract = TEtoSpecsData & {
  // contract is undefined when ETO is not on blockchain
  contract: TEtoContractData | undefined;
};

export type TEtoWithCompanyAndContract = TEtoWithContract & {
  company: TCompanyEtoData;
  subState: EEtoSubState | undefined;
};

export type TEtoWithCompanyAndContractReadonly = DeepReadonly<TEtoWithCompanyAndContract>;

export type TEtoWithCompanyAndContractTypeChecked = TEtoWithCompanyAndContractReadonly & {
  contract: Exclude<TEtoWithCompanyAndContractReadonly["contract"], undefined>;
};

export interface IEtoTokenData {
  balanceUlps: string;
  balanceDecimals: number;
  tokensPerShare: string;
  totalCompanyShares: string;
  companyValuationEurUlps: string;
  tokenPrice: string;
  canTransferToken: boolean;
}

export interface IEtoTokenGeneralDiscounts {
  whitelistDiscount: string;
  discountedTokenPrice: string;
  publicDiscountFrac: number;
  publicDiscount: string;
}

export enum EEtoSubState {
  MARKETING_LISTING_IN_REVIEW = "marketing_listing_in_review",
  WHITELISTING = "whitelisting",
  CAMPAIGNING = "campaigning",
  COUNTDOWN_TO_PRESALE = "countdown_to_presale",
  COUNTDOWN_TO_PUBLIC_SALE = "countdown_to_public_sale",
}

export enum EEtoAgreementStatus {
  NOT_DONE = "not_done",
  DONE = "done",
  ERROR = "error",
}

export type TOfferingAgreementsStatus = Dictionary<EEtoAgreementStatus, EAgreementType>;

export type SignedISHAStatus = {
  isLoading: boolean;
  url: string | undefined;
};

export type TSocialChannel = {
  type: string;
  url: string;
};

export type TSocialChannels = TSocialChannel[];

export enum EEtoStateColor {
  BLUE = "blue",
  ORANGE = "orange",
  GREEN = "green",
  RED = "red",
}

export enum EEtoStateUIName {
  CAMPAIGNING = "campaigning",
  DRAFT = "draft",
  PENDING = "pending",
  ON_CHAIN = "on-chain",
  SUSPENDED = "suspended",
  PRESALE = "presale",
  PUBLIC_SALE = "public-sale",
  IN_SIGNING = "in-signing",
  CLAIM = "claim",
  PAYOUT = "payout",
  REFUND = "refund",
  WHITELISTING = "whitelisting",
}
