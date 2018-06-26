import { DeepPartial } from "../../types";
import * as YupTS from "../yup-ts";

/** COMPANY ETO RELATED INTERFACES
 *  only deals with "/companies/me"
 */

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

type TEtoProductVision = YupTS.TypeOf<typeof EtoProductVisionType>;

export const EtoKeyIndividualsType = YupTS.object({
  teamMemberName: YupTS.string(),
  teamMemberRole: YupTS.string(),
  teamMemberShortBio: YupTS.string(),
  // here we are missing image uploading data
});

type TEtoKeyIndividualsType = YupTS.TypeOf<typeof EtoKeyIndividualsType>;

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

type TEtoTermsType = YupTS.TypeOf<typeof EtoTermsType>;

export const EtoLegalInformationType = YupTS.object({
  name: YupTS.string(),
  legalForm: YupTS.string(),
  street: YupTS.string(),
  country: YupTS.string(),
  vatNumber: YupTS.string().optional(),
  registrationNumber: YupTS.string().optional(),
  foundingDate: YupTS.string().optional(),
  numberOfEmployees: YupTS.string().optional(),
  companyStage: YupTS.string(),
  numberOfFounders: YupTS.number(),
  lastFundingSizeEur: YupTS.number().optional(),
  companyShares: YupTS.number(),
});
type TEtoLegalData = YupTS.TypeOf<typeof EtoCompanyInformationType>;

export type TCompanyEtoData =
  | TEtoTeamData
  | TEtoLegalData
  | TEtoProductVision
  | TEtoTermsType
  | TEtoKeyIndividualsType;

/** ETO SPEC RELATED INTERFACES
 *  only deals with "/etos/me"
 */

export const EtoSpecsInformationType = YupTS.object({
  companyId: YupTS.string(),
  companyTokenHolderAgreementIfps: YupTS.string(),
  currencies: YupTS.array(YupTS.string()),
  equityTokenPrecision: YupTS.number(),
  equityTokensPerShare: YupTS.number(),
  etoId: YupTS.string(),
  generalVotingDurationDays: YupTS.number(),
  generalVotingRule: YupTS.string(),
  hasDragAlongRights: YupTS.boolean(),
  hasFoundersVesting: YupTS.boolean(),
  hasGeneralInformationRights: YupTS.boolean(),
  hasTagAlongRights: YupTS.boolean(),
  investmentAndShareholderAgreementIfps: YupTS.string(),
  isBookbuilding: YupTS.boolean(),
  isCrowdfunding: YupTS.boolean(),
  maxTicketEur: YupTS.number(),
  minTicketEur: YupTS.number(),
  pamphletTemplateIpfs: YupTS.string(),
  previewCode: YupTS.string(),
  prospectusTemplateIfps: YupTS.string(),
  publicDurationDays: YupTS.number(),
  reservationAndAcquisitionAgreementIfps: YupTS.string(),
  restrictedActVotingDurationDays: YupTS.number(),
  shareNominalValueRur: YupTS.number(),
  signingDurationDays: YupTS.number(),
  state: YupTS.string(),
  tagAlongVotingRule: YupTS.string(),
  tokenholdersQuorum: YupTS.number(),
  whitelistDurationDays: YupTS.number(),
});

export type TEtoSpecsData = YupTS.TypeOf<typeof EtoSpecsInformationType>;

/*General Interfaces */
export type TPartialEtoSpecData = DeepPartial<TEtoSpecsData>;
export type TPartialCompanyEtoData = DeepPartial<TCompanyEtoData>;

export type TGeneralEtoData = {
  etoData: TPartialEtoSpecData;
  companyData: TPartialCompanyEtoData;
};
