import { TGeneralEtoData, TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";
import { ICalculatedContribution } from "./reducer";

export const etoActions = {
  // public actions
  loadEtoPreview: (previewCode: string) =>
    createAction("PUBLIC_ETOS_LOAD_ETO_PREVIEW", { previewCode }),
  loadEtos: () => createSimpleAction("PUBLIC_ETOS_LOAD_ETOS"),
  loadCurrentCalculatedContribution: (investmentEurUlps?: string) => createAction("PUBLIC_ETOS_LOAD_CURRENT_CALCULATED_CONTRIBUTION", {investmentEurUlps}),
  changeCurrentEto: (etoId: string) => createAction("PUBLIC_ETOS_CHANGE_CURRENT_ETO", {etoId}),
  // state mutations
  setEtos: (etos: TPublicEtoData[]) => createAction("PUBLIC_ETOS_SET_ETOS", { etos }),
  setCurrentEto: (etoId: string) => createAction("PUBLIC_ETOS_SET_CURRENT_ETO", { etoId }),
  setCalculatedContribution: (etoId: string, contrib: ICalculatedContribution) => createAction("PUBLIC_ETOS_SET_CALCULATED_CONTRIBUTION", {etoId, contrib})
};
