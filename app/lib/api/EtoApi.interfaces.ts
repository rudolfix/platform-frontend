import * as Yup from "yup";
import { foundingDate, makeAllRequired, personBirthDate } from "./util/schemaHelpers";

// legacy?
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
 * Main Eto data interface
 */

export interface IEtoPerson {
  fullName?: string;
  socialChannels: string[];
}

export const EtoPersonSchema = Yup.object().shape({
  fullName: Yup.string(),
  socialChannels: Yup.array().of(Yup.string()),
});

export interface IEtoCaptableEntry extends IEtoPerson {
  ownership?: number;
}

export const EtoCaptableEntrySchema = EtoPersonSchema.concat(
  Yup.object().shape({
    ownership: Yup.number(),
  })
)

export interface IEtoFounder extends IEtoPerson {
  role?: string;
  bio?: string;
}

export const EtoFounderSchema = EtoPersonSchema.concat(
  Yup.object().shape({
    role: Yup.string(),
    bio: Yup.string()
  })
)

export interface IEtoData {
  name?: string;
  website?: string;
  description?: string;
  categories?: string;
  socialChannels?: string[];
  captable?: IEtoCaptableEntry[];
  founders?: IEtoFounder[];
  notableInvestors?: IEtoPerson[];
  advisors?: IEtoPerson[];
  salesModel?: string;
  marketingApproach?: string;
  usp?: string;
  keyCompetitors?: string;
  solvedProblem?: string;
  targetSegment?: string;
  vision?: string;
  priorities?: string;
  inspiration?: string;
  capitalUsage?: string;
  tokenizedShares?: number;
  sharePrice?: number;
  tokenName?: string;
  thirdPartyDependency?: boolean;
  subjectToRegulation?: boolean;
}

export const EtoDataSchema = Yup.object().shape({
  name: Yup.string(),
  website: Yup.string(),
  description: Yup.string(),
  categories: Yup.string(),
  socialChannels: Yup.array().of(Yup.string()),
  captable: Yup.array().of(EtoCaptableEntrySchema),
  founders: Yup.array().of(EtoFounderSchema),
  notableInvestors: Yup.array().of(EtoPersonSchema),
  advisors: Yup.array().of(EtoPersonSchema),
  salesModel: Yup.string(),
  marketingApproach: Yup.string(),
  usp: Yup.string(),
  keyCompetitors: Yup.string(),
  solvedProblem: Yup.string(),
  targetSegment: Yup.string(),
  vision: Yup.string(),
  priorities: Yup.string(),
  inspiration: Yup.string(),
  capitalUsage: Yup.string(),
  tokenizedShares: Yup.number(),
  sharePrice: Yup.number(),
  tokenName: Yup.string(),
  thirdPartyDependency: Yup.boolean(),
  subjectToRegulation: Yup.boolean()
})


