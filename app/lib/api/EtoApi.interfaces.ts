import * as Yup from "yup";
import { foundingDate, makeAllRequired, personBirthDate } from "./util/schemaHelpers";

/**
 * General
 */
export interface IEtoPerson {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  birthDate?: string;
}

export const EtoPersonSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  street: Yup.string(),
  city: Yup.string(),
  zipCode: Yup.string(),
  country: Yup.string(),
  birthDate: personBirthDate,
  isPoliticallyExposed: Yup.bool(),
});

export interface IEtoSimplePerson {
  fullName?: string;
  socialChannels: string[];
}

export const EtoSimplePersonSchema = Yup.object().shape({
  fullName: Yup.string(),
  socialChannels: Yup.array().of(Yup.string()),
});

// file
export interface IEtoFileInfo {
  id: string;
  fileName: string;
}

export const EtoFileInfoSchema = Yup.object().shape({
  id: Yup.string(),
  fileName: Yup.string(),
});

/**
 * Company information
 */
export interface IEtoCompanyInformation {
  name?: string;
  website?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  foundingDate?: string;
  registrationNumber?: string;
  vatNumber?: string;
  legalForm?: string;
  description?: string;
  categories?: string[];
  socialChannels?: string[];
}

export const EtoCompanyInformationSchema = Yup.object().shape({
  name: Yup.string(),
  website: Yup.string(),
  street: Yup.string(),
  city: Yup.string(),
  zipCode: Yup.string(),
  country: Yup.string(),
  foundingDate: foundingDate,
  registrationNumber: Yup.string(),
  vatNumber: Yup.string(),
  legalForm: Yup.string(),
  description: Yup.string(),
  categories: Yup.array().of(Yup.string()),
  socialChannels: Yup.array().of(Yup.string()),
});

export const EtoCompanyInformationSchemaRequired = makeAllRequired(EtoCompanyInformationSchema);

/**
 * Legal Representative Page
 */
export interface IEtoLegalRepresentative extends IEtoPerson {}

export const EtoLegalRepresentativeSchema = EtoPersonSchema;

export const EtoLegalRepresentativeSchemaRequired = makeAllRequired(EtoLegalRepresentativeSchema);

export interface IEtoBeneficialOwner extends IEtoPerson {
  ownership?: number;
  id?: string;
}
export const EtoBeneficialOwnerSchema = EtoPersonSchema.concat(
  Yup.object().shape({
    ownership: Yup.number(),
    id: Yup.string(),
  }),
);
export const EtoBeneficialOwnerSchemaRequired = makeAllRequired(EtoBeneficialOwnerSchema);

/**
 * Team and investors
 */
export interface IEtoTeamInformation {
  numberOfEmployees?: number;
}
export const EtoTeamInformationSchema = Yup.object().shape({
  numberOfEmployees: Yup.number(),
});
export const EtoTeamInformationSchemaRequired = makeAllRequired(EtoTeamInformationSchema);

// founders
export interface IEtoFounder {
  fullName?: string;
  role?: string;
  bio?: string;
  socialChannels?: string[];
}
export const EtoFounderSchema = Yup.object().shape({
  numberOfEmployees: Yup.number(),
  socialChannels: Yup.array().of(Yup.string()),
  role: Yup.string(),
  bio: Yup.string(),
});
export const EtoFounderSchemaRequired = makeAllRequired(EtoTeamInformationSchema);

// captable
export interface IEtoCaptableEntry {
  fullName?: string;
  ownership?: number;
  socialChannels?: string[];
}
export const EtoCaptableEntry = Yup.object().shape({
  fullName: Yup.string(),
  ownership: Yup.number(),
  socialChannels: Yup.array().of(Yup.string()),
});
export const EtoCaptableEntryRequired = makeAllRequired(EtoTeamInformationSchema);

// notable investors
export interface IEtoNotableInvestor extends IEtoSimplePerson {}
export const EtoNotableInvestorSchema = EtoSimplePersonSchema;
export const EtoNotableInvestorSchemaRequired = makeAllRequired(EtoTeamInformationSchema);

// advisors
export interface IEtoAdvisor extends IEtoSimplePerson {}
export const EtoAdvisorSchema = EtoSimplePersonSchema;
export const EtoAdvisorSchemaRequired = makeAllRequired(EtoTeamInformationSchema);

/**
 * Market information
 */
export interface IEtoMarketInformation {
  salesModel?: string;
  marketingApproach?: string;
  usp?: string;
  keyCompetitors?: string;
}

export const EtoMarketInformationSchema = Yup.object().shape({
  salesModel: Yup.string(),
  marketingApproach: Yup.string(),
  usp: Yup.string(),
  keyCompetitors: Yup.string(),
});
export const EtoMarketInformationSchemaRequired = makeAllRequired(EtoMarketInformationSchema);

// business partners
export interface IEtoBusinessPartners extends IEtoSimplePerson {}
export const EtoBusinessPartnersSchema = EtoSimplePersonSchema;
export const EtoBusinessPartnersSchemaRequired = makeAllRequired(EtoTeamInformationSchema);

// key customers
export interface IEtoKeyCustomer extends IEtoSimplePerson {}
export const EtoKeyCustomerSchema = EtoSimplePersonSchema;
export const EtoKeyCustomerSchemaRequired = makeAllRequired(EtoTeamInformationSchema);

/**
 * Product and vision
 */
export interface IEtoProductAndVision {
  solvedProblem?: string;
  target?: string;
  vision?: string;
  priorities?: string;
  inspiration?: string;
  capitalUsage?: string;
}
export const EtoProductAndVisionSchema = Yup.object().shape({
  solvedProblem: Yup.string(),
  target: Yup.string(),
  vision: Yup.string(),
  priorities: Yup.string(),
  inspiration: Yup.string(),
  capitalUsage: Yup.string(),
});
export const EtoProductAndVisionSchemaRequired = makeAllRequired(EtoProductAndVisionSchema);

/**
 * Eto terms
 */
export interface IEtoTerms {
  tokenizedShares?: number;
  sharePrice?: number;
  tokenName?: string;
  thirdPartyDependency?: boolean;
  subjectToRegulation?: boolean;
}

export const EtoTermsSchema = Yup.object().shape({
  tokenizedShares: Yup.number(),
  sharePrice: Yup.string(),
  tokenName: Yup.string(),
  thirdPartyDependency: Yup.boolean(),
  subjectToRegulation: Yup.boolean(),
});
export const EtoTermsSchemaRequired = makeAllRequired(EtoTermsSchema);
