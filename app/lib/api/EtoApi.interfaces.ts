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

const tagsType = YupTS.string()

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
  companyLogo: YupTS.string().optional(),
  companyBanner: YupTS.string().optional(),
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

export const EtoRiskAssesmentType = YupTS.object({
  riskNotRegulatedBusiness: YupTS.onlyTrue(),
  riskNoThirdPartyDependency: YupTS.onlyTrue(),
  riskNoLoansExist: YupTS.onlyTrue(),
  riskLiquidityDescription: YupTS.string(),
  riskThirdPartyDescription: YupTS.string(),
  riskThirdPartySharesFinancing: YupTS.string(),
  riskChangingAgreementDescription: YupTS.string(),
  riskMaxDescription: YupTS.string(),
});

type TEtoRiskAssesment = YupTS.TypeOf<typeof EtoRiskAssesmentType>;

const socialChannelsType = YupTS.array(
  YupTS.object({
    type: YupTS.string().optional(),
    url: YupTS.string().optional(),
  }),
)

const groupType = YupTS.object({
  description: YupTS.string(),
  members: YupTS.array(
    YupTS.object({
      name: YupTS.string(),
      role: YupTS.string().optional(),
      image: YupTS.string().optional(),
      description: YupTS.string(),
      socialChannels: socialChannelsType.optional()
    })
  )
})

export const EtoKeyIndividualsType = YupTS.object({
  team: groupType,
  founders: groupType,
  boardMembers: groupType,
  notableInvestors: groupType,
  keyCustomers: groupType,
  partners: groupType,
  keyAlliances: groupType,
});

type TEtoKeyIndividualsType = YupTS.TypeOf<typeof EtoKeyIndividualsType>;

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
type TEtoLegalData = YupTS.TypeOf<typeof EtoLegalInformationType>;

const linkType = YupTS.object({
  title: YupTS.string().optional(),
  url: YupTS.string().optional(),
})

export const EtoMediaType = YupTS.object({
  companyVideo: linkType,
  socialChannels: socialChannelsType.optional(),
  companyNews: YupTS.array(linkType).optional(),
  disableTwitterFeed: YupTS.boolean().optional(),
});

type TEtoMediaData = YupTS.TypeOf<typeof EtoMediaType>;

export type TCompanyEtoData =
  & TEtoTeamData
  & TEtoLegalData
  & TEtoProductVision
  & TEtoRiskAssesment
  & TEtoKeyIndividualsType
  & TEtoMediaData;

/** ETO SPEC RELATED INTERFACES
 *  only deals with "/etos/me"
 */

export const EtoTermsType = YupTS.object({
  equityTokenName: YupTS.string(),
  equityTokenSymbol: YupTS.string(),
  equityTokenImage: YupTS.string(),
  equityTokensPerShare: YupTS.number(),
  fullyDilutedPreMoneyValuationEur: YupTS.number(),
  existingCompanyShares: YupTS.number(),
  newSharesToIssue: YupTS.number(),
  maximumNewSharesToIssue: YupTS.number(),
  discountScheme: YupTS.string(),
  shareNominalValueEur: YupTS.number(),
  publicDurationDays: YupTS.number(),
  minTicketEur: YupTS.number(),
  maxTicketEur: YupTS.number().optional(),
  enableTransferOnSuccess: YupTS.boolean(),
  // TODO: This fields moved to Risk Assesment and needs to be disconnected here
  riskRegulatedBusiness: YupTS.boolean(),
  // TODO: This fields moved to Risk Assesment and needs to be disconnected here
  riskThirdParty: YupTS.boolean(),
  liquidationPreferenceMultiplier: YupTS.number(),
  tagAlongVotingRule: YupTS.boolean(),
  whitelistDurationDays: YupTS.number(),
  minimumNewSharesToIssue: YupTS.number(),
});

type TEtoTermsType = YupTS.TypeOf<typeof EtoTermsType>;

export const EtoGeneralType = YupTS.object({
  currencies: YupTS.array(YupTS.string()),
  generalVotingRule: YupTS.string().optional()
})

type TEtoGeneralType = YupTS.TypeOf<typeof EtoGeneralType>;

export type TEtoSpecsData = TEtoTermsType & TEtoGeneralType;

/*General Interfaces */
export type TPartialEtoSpecData = DeepPartial<TEtoSpecsData>;
export type TPartialCompanyEtoData = DeepPartial<TCompanyEtoData>;

export type TGeneralEtoData = {
  etoData: TPartialEtoSpecData;
  companyData: TPartialCompanyEtoData;
};
