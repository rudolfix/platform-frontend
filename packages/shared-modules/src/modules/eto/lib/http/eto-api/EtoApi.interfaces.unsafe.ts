import {
  DeepPartial,
  DeepReadonly,
  Dictionary,
  ECurrency,
  EquityToken,
  EthereumAddressWithChecksum,
  MAX_PERCENTAGE,
  MAX_RESTRICTED_ACT_VOTING_DURATION,
  MAX_VOTING_DURATION,
  MAX_VOTING_FINALIZATION_DURATION,
  MAX_VOTING_MAJORITY_FRACTION,
  MAX_VOTING_QUORUM,
  MIN_COMPANY_SHARE_CAPITAL,
  MIN_EXISTING_SHARE_CAPITAL,
  MIN_NEW_SHARES_TO_ISSUE,
  MIN_NEW_SHARE_NOMINAL_VALUE,
  MIN_PRE_MONEY_VALUATION_EUR,
  MIN_RESTRICTED_ACT_VOTING_DURATION,
  MIN_VOTING_DURATION,
  MIN_VOTING_FINALIZATION_DURATION,
  MIN_VOTING_MAJORITY_FRACTION,
  MIN_VOTING_QUORUM,
  NEW_SHARES_TO_ISSUE_IN_FIXED_SLOTS,
  NEW_SHARES_TO_ISSUE_IN_WHITELIST,
} from "@neufund/shared-utils";
import { NumberSchema, StringSchema } from "yup";

import { currencyCodeSchema, dateSchema, percentage } from "../../../../../lib/yup/custom-schemas";
import { TypeOfYTS, YupTS } from "../../../../../lib/yup/yup-ts.unsafe";
import { IBookBuildingStats } from "../../../../bookbuilding/lib/http/eto-pledge-api/EtoPledgeApi.interfaces.unsafe";
import { EResolutionDocumentType, TEtoDocumentTemplates } from "./EtoFileApi.interfaces";
import { TEtoProduct } from "./EtoProductsApi.interfaces";

/**
 * Custom schema translations are baked in to this file, as this code is
 * outdated they will go soon.
 */
const VALIDATION_TICKET_LESS_THAN_ACCEPTED =
  "The minimum ticket size accepted at the moment is {value} Euro";
const VALIDATION_TICKET_LESS_THAN_MINIMUM = "The maximum ticket size is less than minimum";
const VALIDATION_FIELDS_SHOULD_MATCH = "Values of {fieldNames} should match";
const VALIDATION_MAX_NEW_SHARES_LESS_THAN_MINIMUM = "Maximum new shares is less than minimum";

/** COMPANY ETO RELATED INTERFACES
 *  only deals with "/companies/me"
 */

export const CurrencyCodeType = YupTS.string().enhance(currencyCodeSchema);

const EtoFounderType = YupTS.object({
  fullName: YupTS.string(),
  role: YupTS.string(),
  bio: YupTS.string(),
});
export type TEtoFounder = TypeOfYTS<typeof EtoFounderType>;

const tagsType = YupTS.string();

const EtoCapitalListType = YupTS.object({
  description: YupTS.string().optional(),
  percent: YupTS.number()
    .optional()
    .enhance(() => percentage),
}).optional();

export const EtoCompanyInformationType = YupTS.object({
  brandName: YupTS.string(),
  companyWebsite: YupTS.url(),
  companyOneliner: YupTS.string(),
  companyDescription: YupTS.wysiwygString(),
  keyQuoteFounder: YupTS.string(),
  keyQuoteInvestor: YupTS.string().optional(),
  categories: YupTS.array(tagsType).optional(),
  companyLogo: YupTS.string().optional(),
  companyBanner: YupTS.string().optional(),
  companyPreviewCardBanner: YupTS.string(),
});
type TEtoTeamData = TypeOfYTS<typeof EtoCompanyInformationType>;

export const EtoPitchType = YupTS.object({
  problemSolved: YupTS.wysiwygString().optional(),
  productVision: YupTS.wysiwygString().optional(),
  inspiration: YupTS.wysiwygString().optional(),
  roadmap: YupTS.wysiwygString().optional(),
  useOfCapital: YupTS.wysiwygString(),
  useOfCapitalList: YupTS.array(EtoCapitalListType),
  customerGroup: YupTS.wysiwygString().optional(),
  sellingProposition: YupTS.wysiwygString().optional(),
  marketingApproach: YupTS.wysiwygString().optional(),
  companyMission: YupTS.wysiwygString().optional(),
  targetMarketAndIndustry: YupTS.wysiwygString().optional(),
  keyBenefitsForInvestors: YupTS.wysiwygString().optional(),
  keyCompetitors: YupTS.wysiwygString().optional(),
  marketTraction: YupTS.wysiwygString().optional(),
  impact: YupTS.wysiwygString().optional(),
  businessModel: YupTS.wysiwygString().optional(),
});

type TEtoProductVision = TypeOfYTS<typeof EtoPitchType>;

export const EtoRiskAssessmentType = YupTS.object({
  riskNotRegulatedBusiness: YupTS.onlyTrue(),
  riskNoThirdPartyDependency: YupTS.onlyTrue(),
  riskNoLoansExist: YupTS.onlyTrue(),
  riskLiquidityDescription: YupTS.string().optional(),
  riskThirdPartyDescription: YupTS.string().optional(),
  riskThirdPartySharesFinancing: YupTS.string().optional(),
  riskBusinessModelDescription: YupTS.string().optional(),
  riskMaxDescription: YupTS.string().optional(),
});

type TEtoRiskAssessment = TypeOfYTS<typeof EtoRiskAssessmentType>;

export enum ESocialChannelType {
  FACEBOOK = "facebook",
  GITHUB = "github",
  G_PLUS = "gplus",
  INSTAGRAM = "instagram",
  LINKEDIN = "linkedin",
  MEDIUM = "medium",
  REDDIT = "reddit",
  SLACK = "slack",
  TELEGRAM = "telegram",
  TWITTER = "twitter",
  XING = "xing",
  BITCOINTALK = "bitcointalk",
  YOUTUBE = "youtube",
}

const socialChannelType = YupTS.object({
  type: YupTS.string<ESocialChannelType>().optional(),
  url: YupTS.url().optional(),
});

export type TSocialChannelType = TypeOfYTS<typeof socialChannelType>;

const socialChannelsType = YupTS.array(socialChannelType);

export type TSocialChannelsType = TypeOfYTS<typeof socialChannelsType>;

export const EtoKeyIndividualType = YupTS.object({
  members: YupTS.array(
    YupTS.object({
      name: YupTS.string(),
      role: YupTS.string().optional(),
      image: YupTS.string().optional(),
      description: YupTS.string().optional(),
      website: YupTS.url().optional(),
      socialChannels: socialChannelsType.optional(),
    }),
  ).optional(),
});

export type TEtoKeyIndividualType = TypeOfYTS<typeof EtoKeyIndividualType>;

export const EtoKeyIndividualsType = YupTS.object({
  team: EtoKeyIndividualType.optional(),
  advisors: EtoKeyIndividualType.optional(),
  boardMembers: EtoKeyIndividualType.optional(),
  notableInvestors: EtoKeyIndividualType.optional(),
  keyCustomers: EtoKeyIndividualType.optional(),
  partners: EtoKeyIndividualType.optional(),
  keyAlliances: EtoKeyIndividualType.optional(),
});

type TEtoKeyIndividualsType = TypeOfYTS<typeof EtoKeyIndividualsType>;

const EtoLegalShareholderType = YupTS.object({
  fullName: YupTS.string().optional(),
  shareCapital: YupTS.number()
    .optional()
    .enhance(v => v.moreThan(0)),
});

export type TEtoLegalShareholderType = TypeOfYTS<typeof EtoLegalShareholderType>;

export enum EFundingRound {
  PRE_SEED = "pre_seed",
  SEED = "seed",
  A_ROUND = "a_round",
  B_ROUND = "b_round",
  C_ROUND = "c_round",
  D_ROUND = "d_round",
  E_ROUND = "e_round",
  PRE_IPO = "pre_ipo",
  PUBLIC = "public",
}

export const EtoLegalInformationType = YupTS.object({
  name: YupTS.string(),
  legalForm: YupTS.string(),
  companyLegalDescription: YupTS.string(),
  street: YupTS.string(),
  country: YupTS.string(),
  vatNumber: YupTS.string().optional(),
  registrationNumber: YupTS.string(),
  foundingDate: YupTS.string().enhance((v: StringSchema) => dateSchema(v)),
  numberOfEmployees: YupTS.string().optional(),
  companyStage: YupTS.string<EFundingRound>().optional(),
  numberOfFounders: YupTS.number().optional(),
  lastFundingSizeEur: YupTS.number().optional(),
  companyShareCapital: YupTS.number().enhance(v => v.min(MIN_COMPANY_SHARE_CAPITAL)),
  shareCapitalCurrencyCode: CurrencyCodeType,
  shareholders: YupTS.array(EtoLegalShareholderType),
});
type TEtoLegalData = TypeOfYTS<typeof EtoLegalInformationType>;

const marketingLinksType = YupTS.array(
  YupTS.object({
    title: YupTS.string().optional(),
    url: YupTS.url().optional(),
  }),
);

const companyNewsType = YupTS.array(
  YupTS.object({
    title: YupTS.string().optional(),
    url: YupTS.url().optional(),
    publication: YupTS.string().optional(),
  }),
);

export const EtoMediaType = YupTS.object({
  companyVideo: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url().optional(),
  }).optional(),
  companySlideshare: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url().optional(),
  }).optional(),
  companyPitchdeckUrl: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url(),
  }).optional(),
  socialChannels: socialChannelsType.optional(),
  companyNews: companyNewsType.optional(),
  marketingLinks: marketingLinksType.optional(),
  disableTwitterFeed: YupTS.boolean().optional(),
});

export type TEtoMediaData = TypeOfYTS<typeof EtoMediaType>;

type TEtoCompanyBase = {
  companyId: string;
  city: string;
};

export type TCompanyEtoData = DeepReadonly<
  TEtoCompanyBase &
    TEtoTeamData &
    TEtoLegalData &
    TEtoProductVision &
    TEtoRiskAssessment &
    TEtoKeyIndividualsType &
    TEtoMediaData
>;

/** ETO SPEC RELATED INTERFACES
 *  only deals with "/etos/me"
 */

export enum EEtoState {
  PREVIEW = "preview",
  PENDING = "pending",
  LISTED = "listed",
  PROSPECTUS_APPROVED = "prospectus_approved",
  ON_CHAIN = "on_chain",
  SUSPENDED = "suspended",
}

export enum EEtoMarketingDataVisibleInPreview {
  VISIBLE = "visible",
  NOT_VISIBLE = "not_visible",
  VISIBILITY_PENDING = "visibility_pending",
}

export enum EtoStateToCamelcase {
  "preview" = "preview",
  "pending" = "pending",
  "listed" = "listed",
  "prospectus_approved" = "prospectusApproved",
  "on_chain" = "onChain",
  "suspended" = "suspended",
}

// Since only keys are transformed from snake case to camel case we have to manually map states
// see@ swagger /api/eto-listing/ui/#!/ETO/api_eto_get_me
// see@ swagger api/eto-listing/ui/#!/Documents/api_document_documents_state_info

export const getEtoTermsSchema = ({
  minTicketSize,
  maxTicketSize,
  maxWhitelistDurationDays,
  minWhitelistDurationDays,
  maxSigningDurationDays,
  minSigningDurationDays,
  maxPublicDurationDays,
  minPublicDurationDays,
}: Partial<TEtoProduct> = {}) =>
  YupTS.object({
    currencies: YupTS.array(YupTS.string<ECurrency>()),
    prospectusLanguage: YupTS.string(),
    minTicketEur: YupTS.number().enhance((v: NumberSchema) =>
      minTicketSize !== undefined ? v.min(minTicketSize, VALIDATION_TICKET_LESS_THAN_ACCEPTED) : v,
    ),
    maxTicketEur: YupTS.number()
      .optional()
      .enhance(v => {
        v = v.when("minTicketEur", (value: number) =>
          v.min(value, VALIDATION_TICKET_LESS_THAN_MINIMUM),
        );

        if (maxTicketSize && maxTicketSize > 0) {
          v = v.max(maxTicketSize);
        }

        return v;
      }),
    enableTransferOnSuccess: YupTS.boolean(),
    tokenTradeableOnSuccess: YupTS.boolean().optional(),
    whitelistDurationDays: YupTS.number().enhance(v => {
      if (minWhitelistDurationDays !== undefined) {
        v = v.min(minWhitelistDurationDays);
      }

      if (maxWhitelistDurationDays !== undefined) {
        v = v.max(maxWhitelistDurationDays);
      }

      return v;
    }),
    publicDurationDays: YupTS.number().enhance(v => {
      if (minPublicDurationDays !== undefined) {
        v = v.min(minPublicDurationDays);
      }

      if (maxPublicDurationDays !== undefined) {
        v = v.max(maxPublicDurationDays);
      }

      return v;
    }),
    signingDurationDays: YupTS.number().enhance(v => {
      if (minSigningDurationDays !== undefined) {
        v = v.min(minSigningDurationDays);
      }

      if (maxSigningDurationDays !== undefined) {
        v = v.max(maxSigningDurationDays);
      }

      return v;
    }),
  });

export const EtoInvestmentCalculatedValues = YupTS.object({
  minInvestmentAmount: YupTS.number(),
  maxInvestmentAmountWithAllDiscounts: YupTS.number(),
  maxInvestmentAmount: YupTS.number(),
  effectiveMaxTicket: YupTS.number(),
  sharePrice: YupTS.number(),
  publicSharePrice: YupTS.number(),
  discountedSharePrice: YupTS.number(),
  fixedSlotsMinSharePrice: YupTS.number(),
  canBeListed: YupTS.boolean(),
  canGoOnChain: YupTS.boolean(),
});

export type TEtoInvestmentCalculatedValues = TypeOfYTS<typeof EtoInvestmentCalculatedValues>;

export type TEtoTermsType = TypeOfYTS<ReturnType<typeof getEtoTermsSchema>>;

export const EtoEquityTokenInfoType = YupTS.object({
  equityTokenName: YupTS.string(),
  equityTokenSymbol: YupTS.string<EquityToken>(),
  equityTokenImage: YupTS.string(),
});

export type TEtoEquityTokenInfoType = TypeOfYTS<typeof EtoEquityTokenInfoType>;

export enum ETagAlongVotingRule {
  NO_VOTING_RIGHTS = "no_voting_rights",
  POSITIVE = "positive",
  NEGATIVE = "negative",
  PROPORTIONAL = "proportional",
}

export enum EGeneralVotingRule {
  NO_VOTING_RIGHTS = "no_voting_rights",
  POSITIVE = "positive",
  NEGATIVE = "negative",
  PROPORTIONAL = "proportional",
}

export const EtoVotingRightsType = YupTS.object({
  liquidationPreferenceMultiplier: YupTS.number(),
  generalVotingRule: YupTS.string(),
  hasGeneralInformationRights: YupTS.boolean(),
  hasDividendRights: YupTS.boolean(),
  tagAlongVotingRule: YupTS.string(),
  generalVotingDurationDays: YupTS.number()
    .enhance(v => v.min(MIN_VOTING_DURATION))
    .enhance(v => v.max(MAX_VOTING_DURATION)),
  restrictedActVotingDurationDays: YupTS.number()
    .enhance(v => v.min(MIN_RESTRICTED_ACT_VOTING_DURATION))
    .enhance(v => v.max(MAX_RESTRICTED_ACT_VOTING_DURATION)),
  votingFinalizationDurationDays: YupTS.number()
    .enhance(v => v.min(MIN_VOTING_FINALIZATION_DURATION))
    .enhance(v => v.max(MAX_VOTING_FINALIZATION_DURATION)),
  votingMajorityFraction: YupTS.number()
    .enhance(v => v.min(MIN_VOTING_MAJORITY_FRACTION))
    .enhance(v => v.max(MAX_VOTING_MAJORITY_FRACTION)),
  shareholdersVotingQuorum: YupTS.number()
    .enhance(v => v.min(MIN_VOTING_QUORUM))
    .enhance(v => v.max(MAX_VOTING_QUORUM)),
  advisoryBoard: YupTS.string().optional(),
  hasDragAlongRights: YupTS.boolean(),
  hasTagAlongRights: YupTS.boolean(),
  hasFoundersVesting: YupTS.boolean(),
  nominee: YupTS.string(),
});

export type TEtoVotingRightsType = TypeOfYTS<typeof EtoVotingRightsType>;

export const EtoInvestmentTermsType = YupTS.object({
  equityTokensPerShare: YupTS.number(),
  newShareNominalValue: YupTS.number().enhance((v: StringSchema) =>
    v.min(MIN_NEW_SHARE_NOMINAL_VALUE),
  ),
  newShareNominalValueEur: YupTS.number().enhance(validator =>
    validator
      .min(MIN_NEW_SHARE_NOMINAL_VALUE)
      .when(
        ["shareCapitalCurrencyCode", "newShareNominalValue"],
        (currencyCode: string, newShareNominalValue: string) => {
          if (currencyCode === "EUR") {
            return validator.test(
              "match",
              VALIDATION_FIELDS_SHOULD_MATCH,
              value => value === newShareNominalValue,
            );
          } else {
            return;
          }
        },
      ),
  ),
  preMoneyValuationEur: YupTS.number().enhance(v => v.min(MIN_PRE_MONEY_VALUATION_EUR)),
  existingShareCapital: YupTS.number().enhance(v => v.min(MIN_EXISTING_SHARE_CAPITAL)),
  shareCapitalCurrencyCode: CurrencyCodeType,
  authorizedCapital: YupTS.number().optional(),
  newSharesToIssue: YupTS.number()
    .enhance(v => v.required())
    .enhance(v =>
      v.when("minimumNewSharesToIssue", (value: number) =>
        v.min(value, VALIDATION_MAX_NEW_SHARES_LESS_THAN_MINIMUM),
      ),
    ),
  minimumNewSharesToIssue: YupTS.number().enhance(v => v.min(MIN_NEW_SHARES_TO_ISSUE)),
  newSharesToIssueInWhitelist: YupTS.number()
    .optional()
    .enhance(v => v.min(NEW_SHARES_TO_ISSUE_IN_WHITELIST)),
  whitelistDiscountFraction: YupTS.number()
    .optional()
    .enhance(v => v.max(MAX_PERCENTAGE)),
  publicDiscountFraction: YupTS.number()
    .optional()
    .enhance(v => v.max(MAX_PERCENTAGE)),
  newSharesToIssueInFixedSlots: YupTS.number()
    .optional()
    .enhance(v => v.min(NEW_SHARES_TO_ISSUE_IN_FIXED_SLOTS)),
  fixedSlotsMaximumDiscountFraction: YupTS.number()
    .optional()
    .enhance(v => v.max(MAX_PERCENTAGE)),
  discountScheme: YupTS.string().optional(),
});

export type TEtoInvestmentTermsType = TypeOfYTS<typeof EtoInvestmentTermsType>;

interface IAdditionalEtoType {
  etoId: EthereumAddressWithChecksum;
  companyId: string;
  previewCode: string;
  state: EEtoState;
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview;
  isBookbuilding: boolean;
  templates: TEtoDocumentTemplates;
  startDate: string;
  documents: TEtoDocumentTemplates;
  maxPledges: number;
  canEnableBookbuilding: boolean;
  product: TEtoProduct;
  nomineeDisplayName?: string;
  hasDividendRights?: boolean;
  equityTokenContractAddress: string;
}

export type TBookbuildingStatsType = {
  amountEur: number;
  consentToRevealEmail: boolean;
  currency: string;
  email?: string;
  etoId?: string;
  insertedAt: string;
  updatedAt: string;
  userId: string;
};

export type TBookBuildingsStatsList = {
  bookbuildingStats: Dictionary<IBookBuildingStats>;
};

export type TEtoSpecsData = TEtoTermsType &
  TEtoEquityTokenInfoType &
  TEtoVotingRightsType &
  TEtoInvestmentTermsType & {
    investmentCalculatedValues?: TEtoInvestmentCalculatedValues;
  } & IAdditionalEtoType;

/* General Interfaces */
// TODO: Get rid of TPartial* given they are not fully correct and introduce state based discriminated union
export type TPartialEtoSpecData = DeepPartial<TEtoSpecsData>;
export type TPartialCompanyEtoData = DeepPartial<TCompanyEtoData>;

// this is coming from the /etos endpoint for investors dashboard
export type TEtoDataWithCompany = TEtoSpecsData & { company: TCompanyEtoData };

export const EtoMarketingDataType = YupTS.object({
  ...EtoEquityTokenInfoType.shape,
  ...EtoMediaType.shape,
  ...EtoLegalInformationType.shape,
  ...EtoPitchType.shape,
  ...EtoCompanyInformationType.shape,
  ...EtoRiskAssessmentType.shape,
});

export type TNomineeRequestResponse = {
  state: "pending" | "approved" | "rejected";
  nomineeId: string;
  etoId: string;
  insertedAt: string;
  updatedAt: string;
  metadata: {
    city: string;
    country: string;
    jurisdiction: string;
    legalForm: string;
    legalFormType: string;
    name: string;
    registrationNumber: string;
    street: string;
    zipCode: string;
  };
};

const FORM_PLEASE_SELECT = "";

export const FUNDING_ROUNDS: Dictionary<string, EFundingRound | "NONE_KEY"> = {
  NONE_KEY: FORM_PLEASE_SELECT,
  [EFundingRound.PRE_SEED]: "Pre-Seed",
  [EFundingRound.SEED]: "Seed",
  [EFundingRound.A_ROUND]: "Series A",
  [EFundingRound.B_ROUND]: "Series B",
  [EFundingRound.C_ROUND]: "Series C",
  [EFundingRound.D_ROUND]: "Series D",
  [EFundingRound.E_ROUND]: "Series E",
  [EFundingRound.PRE_IPO]: "Pre-IPO",
  [EFundingRound.PUBLIC]: "PUBLIC",
};

export enum EMimeType {
  PDF = "application/pdf",
  JPEG = "image/jpeg",
  JPG = "image/jpg",
  PNG = "image/png",
  SVG = "image/svg+xml",
  ANY_IMAGE_TYPE = "image/*",
}

export type TResolutionData = {
  contract: string;
  createdAt: string;
  documentType: EResolutionDocumentType.RESOLUTION_DOCUMENT;
  form: "document";
  ipfsHash: string;
  mimeType: EMimeType.PDF;
  name: string;
  owner: string;
  resolutionId: string;
  size: number;
  title: string;
};
