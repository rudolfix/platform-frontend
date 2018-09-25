import {
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
  TPublicEtoData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";
import { ICalculatedContribution, IEtoContractData } from "./types";

export const etoActions = {
  // public actions
  loadEtoPreview: (previewCode: string) =>
    createAction("PUBLIC_ETOS_LOAD_ETO_PREVIEW", { previewCode }),
  loadEto: (etoId: string) => createAction("PUBLIC_ETOS_LOAD_ETO", { etoId }),
  loadEtos: () => createSimpleAction("PUBLIC_ETOS_LOAD_ETOS"),
  loadCalculatedContribution: (etoId: string, investmentEurUlps?: string) =>
    createAction("PUBLIC_ETOS_LOAD_CALCULATED_CONTRIBUTION", { etoId, investmentEurUlps }),
  // state mutations
  setPublicEtos: (etos: { [etoId: string]: TPublicEtoData }) =>
    createAction("PUBLIC_ETOS_SET_PUBLIC_ETOS", { etos }),
  setPublicEto: (eto: TPublicEtoData) => createAction("PUBLIC_ETOS_SET_PUBLIC_ETO", { eto }),
  setEtosDisplayOrder: (order: string[]) =>
    createAction("PUBLIC_ETOS_SET_DISPLAY_ORDER", { order }),
  setCalculatedContribution: (previewCode: string, contrib: ICalculatedContribution) =>
    createAction("PUBLIC_ETOS_SET_CALCULATED_CONTRIBUTION", { previewCode, contrib }),
  setEtoDataFromContract: (previewCode: string, data: IEtoContractData) =>
    createAction("PUBLIC_ETOS_SET_ETO_DATA_FROM_CONTRACT", { previewCode, data }),
};
