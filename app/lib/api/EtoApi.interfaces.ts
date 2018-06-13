import { DeepPartial } from "../../types";
import * as YupTS from "../yup-ts";

const EtoFounderType = YupTS.object({
  fullName: YupTS.string(),
  role: YupTS.string(),
  bio: YupTS.string(),
});
export type TEtoFounder = YupTS.TypeOf<typeof EtoFounderType>;

const tagsType = YupTS.string();

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

export const EtoLegalInformationType = YupTS.object({
  name: YupTS.string(),
  legalForm: YupTS.string(),
  street: YupTS.string(),
  country: YupTS.string(),
  registrationNumber: YupTS.string().optional(),
  vatNumber: YupTS.string().optional(),
  foundingDate: YupTS.string().optional(),
  numberOfEmployees: YupTS.string().optional(),
  numberOfFounders: YupTS.number(),
  companyStage: YupTS.string(),
  lastFundingSizeEur: YupTS.number().optional(),
  companyShares: YupTS.number(),
});
type TEtoLegalData = YupTS.TypeOf<typeof EtoCompanyInformationType>;

export type TEtoData = TEtoTeamData | TEtoLegalData; // | other partial schemas;
export type TPartialEtoData = DeepPartial<TEtoData>;
