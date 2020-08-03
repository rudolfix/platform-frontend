import {
  TBookbuildingStatsType,
  TCompanyEtoData,
  TEtoProducts,
  TEtoSpecsData,
} from "@neufund/shared-modules";

export interface IEtoFlowState {
  eto: TEtoSpecsData | undefined;
  company: TCompanyEtoData | undefined;
  products?: TEtoProducts;
  loading: boolean;
  saving: boolean;
  bookbuildingStats: TBookbuildingStatsType[];
  newStartDate?: Date;
  etoDateSaving: boolean;
}
