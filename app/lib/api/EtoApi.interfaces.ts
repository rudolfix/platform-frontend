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

export const EtoProductVisionType = YupTS.object({
  problemSolved: YupTS.string().optional(),
  productVision: YupTS.string().optional(),
  inspiration: YupTS.string().optional(),
  keyProductPriorities: YupTS.string().optional(),
  // useOfCapitalList: YupTS.array(YupTS.object({ description: YupTS.string, percent: YupTS.number })),
  use_of_capital: YupTS.string().optional(),
  // here we are missing some fields
});

type TEtoProductVision = YupTS.TypeOf<typeof EtoProductVisionType>;

export type TEtoData = TEtoTeamData | TEtoProductVision; // | other partial schemas;
export type TPartialEtoData = DeepPartial<TEtoData>;
