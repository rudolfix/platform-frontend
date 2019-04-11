import { TBookbuildingStatsType } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TEtoProducts } from "../../lib/api/eto/EtoProductsApi.interfaces";

export interface IEtoFlowState {
  etoPreviewCode?: string;
  products?: TEtoProducts;
  loading: boolean;
  saving: boolean;
  bookbuildingStats: TBookbuildingStatsType[];
  newStartDate?: Date;
  signedInvestmentAgreementUrlLoading: boolean;
  signedInvestmentAgreementUrl: string | null;
}

export enum EEtoFormTypes {
  CompanyInformation = "companyInformation",
  LegalInformation = "legalInformation",
  KeyIndividuals = "keyIndividuals",
  ProductVision = "productVision",
  EtoTerms = "etoTerms",
  EtoInvestmentTerms = "etoInvestmentTerms",
  EtoMedia = "etoMedia",
  EtoVotingRights = "etoVotingRights",
  EtoEquityTokenInfo = "etoEquityTokenInfo",
  EtoRiskAssessment = "etoRiskAssessment",
}
