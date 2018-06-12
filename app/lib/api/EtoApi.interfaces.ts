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

export type TEtoData = TEtoTeamData; // | other partial schemas;

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
export type TPartialEtoData = DeepPartial<TEtoData>;

export type TFullEtoData = {
  etoData: TPartialEtoSpecData;
  companyData: TPartialEtoData;
};
