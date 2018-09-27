import { TGeneralEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

export const etoFlowActions = {
  loadIssuerEto: () => createSimpleAction("ETO_FLOW_LOAD_ISSUER_ETO"),
  loadDataStart: () => createSimpleAction("ETO_FLOW_LOAD_DATA_START"),
  loadDataStop: () => createSimpleAction("ETO_FLOW_LOAD_DATA_STOP"),
  submitDataStart: () => createSimpleAction("ETO_FLOW_SUBMIT_DATA_START"),
  setIssuerEtoPreviewCode: (etoPreviewCode: string) =>
    createAction("ETO_FLOW_SET_ID", { etoPreviewCode }),
  saveDataStart: (data: Partial<TGeneralEtoData>) =>
    createAction("ETO_FLOW_SAVE_DATA_START", { data }),
  changeBookBuildingStatus: (status: boolean) =>
    createAction("ETO_FLOW_CHANGE_BOOK_BUILDING_STATES", { status }),
};
