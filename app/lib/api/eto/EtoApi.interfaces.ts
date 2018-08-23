import { DeepPartial } from "../../../types";
import * as YupTS from "../../yup-ts";
import { TEtoDocumentTemplates } from "./EtoFileApi.interfaces";

/** COMPANY ETO RELATED INTERFACES
 *  only deals with "/companies/me"
 */

const EtoFounderType = YupTS.object({
  fullName: YupTS.string(),
  role: YupTS.string(),
  bio: YupTS.string(),
});
export type TEtoFounder = YupTS.TypeOf<typeof EtoFounderType>;

const tagsType = YupTS.string();

const EtoCapitalListType = YupTS.object({
  description: YupTS.string().optional(),
  percent: YupTS.number().optional(),
});

export const EtoCompanyInformationType = YupTS.object({
  brandName: YupTS.string(),
  companyWebsite: YupTS.url(),
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

export const EtoRiskAssessmentType = YupTS.object({
  riskNotRegulatedBusiness: YupTS.onlyTrue(),
  riskNoThirdPartyDependency: YupTS.onlyTrue(),
  riskNoLoansExist: YupTS.onlyTrue(),
  riskLiquidityDescription: YupTS.string(),
  riskThirdPartyDescription: YupTS.string(),
  riskThirdPartySharesFinancing: YupTS.string(),
  riskChangingAgreementDescription: YupTS.string(),
  riskMaxDescription: YupTS.string(),
});

type TEtoRiskAssessment = YupTS.TypeOf<typeof EtoRiskAssessmentType>;

const socialChannelsType = YupTS.array(
  YupTS.object({
    type: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url(),
  }),
);

export type TSocialChannelsType = YupTS.TypeOf<typeof socialChannelsType>;

const groupType = YupTS.object({
  description: YupTS.string().optional(),
  members: YupTS.array(
    YupTS.object({
      name: YupTS.string(),
      role: YupTS.string().optional(),
      image: YupTS.string().optional(),
      description: YupTS.string(),
      website: YupTS.url(),
      socialChannels: socialChannelsType.optional(),
    }),
  ),
});

export const EtoKeyIndividualsType = YupTS.object({
  team: groupType.optional(),
  founders: groupType.optional(),
  boardMembers: groupType.optional(),
  notableInvestors: groupType.optional(),
  keyCustomers: groupType.optional(),
  partners: groupType.optional(),
  keyAlliances: groupType.optional(),
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
  shareholders: YupTS.array(
    YupTS.object({
      fullName: YupTS.string(),
      shares: YupTS.number(),
    }),
  ),
});
type TEtoLegalData = YupTS.TypeOf<typeof EtoLegalInformationType>;

const linkType = YupTS.object({
  title: YupTS.string(),
  url: YupTS.url(),
});

export const EtoMediaType = YupTS.object({
  companyVideo: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url(),
  }),
  companySlideshare: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url(),
  }),

  socialChannels: socialChannelsType.optional(),
  companyNews: YupTS.array(linkType).optional(),
  marketingLinks: YupTS.array(linkType).optional(),
  disableTwitterFeed: YupTS.boolean().optional(),
});

type TEtoMediaData = YupTS.TypeOf<typeof EtoMediaType>;

export type TCompanyEtoData = TEtoTeamData &
  TEtoLegalData &
  TEtoProductVision &
  TEtoRiskAssessment &
  TEtoKeyIndividualsType &
  TEtoMediaData;

/** ETO SPEC RELATED INTERFACES
 *  only deals with "/etos/me"
 */

export type EtoState = "preview" | "pending" | "listed" | "prospectus_approved" | "on_chain";

export enum EtoStateEnum {
  "preview" = "preview",
  "pending" = "pending",
  "listed" = "listed",
  "prospectus_approved" = "prospectusApproved",
  "on_chain" = "onChain",
}
// Since only keys are transformed from snake case to camel case we have to manually map states
// see@ swagger /api/eto-listing/ui/#!/ETO/api_eto_get_me
// see@ swagger api/eto-listing/ui/#!/Documents/api_document_documents_state_info

export const EtoTermsType = YupTS.object({
  currencies: YupTS.array(YupTS.string()).optional(),
  discountScheme: YupTS.string(),
  publicDurationDays: YupTS.number(),
  minTicketEur: YupTS.number(),
  maxTicketEur: YupTS.number().optional(),
  enableTransferOnSuccess: YupTS.boolean(),
  notUnderCrowdfundingRegulations: YupTS.onlyTrue(),
  whitelistDurationDays: YupTS.number(),
  additionalTerms: YupTS.string().optional(),
});

export type TEtoTermsType = YupTS.TypeOf<typeof EtoTermsType>;

export const EtoEquityTokenInfoType = YupTS.object({
  equityTokenName: YupTS.string().optional(),
  equityTokenSymbol: YupTS.string().optional(),
  equityTokenImage: YupTS.string().optional(),
});

export type TEtoEquityTokenInfoType = YupTS.TypeOf<typeof EtoEquityTokenInfoType>;

export const EtoVotingRightsType = YupTS.object({
  nominee: YupTS.string().optional(),
  liquidationPreferenceMultiplier: YupTS.number().optional(),
  generalVotingRule: YupTS.string().optional(),
});

export type TEtoVotingRightsType = YupTS.TypeOf<typeof EtoVotingRightsType>;

export const EtoInvestmentTermsType = YupTS.object({
  equityTokensPerShare: YupTS.number().optional(),
  shareNominalValueEur: YupTS.number().optional(),
  fullyDilutedPreMoneyValuationEur: YupTS.number().optional(),
  existingCompanyShares: YupTS.number().optional(),
  authorizedCapitalShares: YupTS.number().optional(),
  newSharesToIssue: YupTS.number().optional(),
  minimumNewSharesToIssue: YupTS.number().optional(),
  newSharesToIssueInWhitelist: YupTS.number().optional(),
  whitelistDiscountFraction: YupTS.number().optional(),
});

export type TEtoInvestmentTermsType = YupTS.TypeOf<typeof EtoInvestmentTermsType>;

interface IAdditionalEtoType {
  state: EtoState;
  isBookbuilding: boolean;
  templates?: TEtoDocumentTemplates;
}

export type TEtoSpecsData = TEtoTermsType &
  TEtoEquityTokenInfoType &
  TEtoVotingRightsType &
  TEtoInvestmentTermsType &
  IAdditionalEtoType;

/*General Interfaces */
export type TPartialEtoSpecData = DeepPartial<TEtoSpecsData>;
export type TPartialCompanyEtoData = DeepPartial<TCompanyEtoData>;

export type TGeneralEtoData = {
  etoData: TPartialEtoSpecData;
  companyData: TPartialCompanyEtoData;
};

export const GeneralEtoDataType = YupTS.object({
  ...EtoTermsType.shape,
  ...EtoEquityTokenInfoType.shape,
  ...EtoVotingRightsType.shape,
  ...EtoMediaType.shape,
  ...EtoLegalInformationType.shape,
  ...EtoKeyIndividualsType.shape,
  ...EtoProductVisionType.shape,
  ...EtoCompanyInformationType.shape,
  ...EtoRiskAssessmentType.shape,
});
