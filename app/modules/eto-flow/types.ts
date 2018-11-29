import {DeepReadonly} from "../../types";
import {TBookbuildingStatsArrayType} from "../../lib/api/eto/EtoApi.interfaces";

export interface IEtoFlowState {
  etoPreviewCode?: string;
  loading: boolean;
  saving: boolean;
  bookbuildingStats: DeepReadonly<TBookbuildingStatsArrayType>;
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
