import { DeepPartial } from "../../types";
import * as YupTS from "../yup-ts";

const EtoFounderType = YupTS.object({
  fullName: YupTS.string(),
  role: YupTS.string(),
  bio: YupTS.string(),
});
export type TEtoFounder = YupTS.TypeOf<typeof EtoFounderType>;

const tagsType = YupTS.string().optional();

const EtoCapitalListType = YupTS.object({
  description: YupTS.string().optional(),
  percent: YupTS.number().optional(),
});

export const EtoCompanyInformationType = YupTS.object({
  brandName: YupTS.string(),
  companyWebsite: YupTS.string(),
  companyOneliner: YupTS.string(),
  companyDescription: YupTS.string(),
  keyQuoteFounder: YupTS.string(),
  keyQuoteInvestor: YupTS.string(),
  categories: YupTS.array(tagsType),
  // here we are missing image uploading data
});
type TEtoTeamData = YupTS.TypeOf<typeof EtoCompanyInformationType>;

export const EtoProductVisionType = YupTS.object({
  problemSolved: YupTS.string().optional(),
  productVision: YupTS.string().optional(),
  inspiration: YupTS.string().optional(),
  keyProductPriorities: YupTS.string().optional(),
  useOfCapital: YupTS.string().optional(),
  useOfCapitalList: YupTS.array(EtoCapitalListType.optional()).optional(),
  customerGroup: YupTS.string().optional(),
  sellingProposition: YupTS.string().optional(),
  marketingApproach: YupTS.string().optional(),
  salesModel: YupTS.string().optional(),
});

export const EtoKeyIndividualsType = YupTS.object({
  teamMemberName: YupTS.string(),
  teamMemberRole: YupTS.string(),
  teamMemberShortBio: YupTS.string(),
  // here we are missing image uploading data
});

export const EtoTermsType = YupTS.object({
  tokenName: YupTS.string(),
  tokenSymbol: YupTS.string(),
  // here we are missing image uploading data
  fullyDilutedPreMoneyValuation: YupTS.number(),
  numberOfExistingShares: YupTS.number(),
  numberOfShares: YupTS.number(),
  // here we are missing automatic recalculated data
  tokenDiscountForWhitelist: YupTS.string(),
  shareNominalValue: YupTS.number(),
  fundraisingCurrency: YupTS.string(),
  // here we are missing prospectus language data
  preSaleDuration: YupTS.number(),
  publicOfferDuration: YupTS.number(),
  minimumTicketSize: YupTS.number(),
  tokenTransfersEnabledAfterEto: YupTS.boolean(),
  etoIsNotUnderCrowdfundingRegulation: YupTS.boolean(),
  hasDependencyOnThirdParties: YupTS.boolean(),
  liquidationPreference: YupTS.number(),
  hasVotingRightsEnabled: YupTS.boolean(),
});

type TEtoProductVision = YupTS.TypeOf<typeof EtoProductVisionType>;

export type TEtoData = TEtoTeamData | TEtoProductVision; // | other partial schemas;
export type TPartialEtoData = DeepPartial<TEtoData>;
