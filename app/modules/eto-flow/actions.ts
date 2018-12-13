import { TGeneralEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

export const etoFlowActions = {
  loadIssuerEto: () => createSimpleAction("ETO_FLOW_LOAD_ISSUER_ETO"),
  loadDataStart: () => createSimpleAction("ETO_FLOW_LOAD_DATA_START"),
  loadDataStop: () => createSimpleAction("ETO_FLOW_LOAD_DATA_STOP"),
  uploadStartDate: () => createSimpleAction("ETO_FLOW_START_DATE_TX"),
  cleanupStartDate: () => createSimpleAction("ETO_FLOW_CLEANUP_START_DATE_TX"),
  submitDataStart: () => createSimpleAction("ETO_FLOW_SUBMIT_DATA_START"),
  setIssuerEtoPreviewCode: (etoPreviewCode: string) =>
    createAction("ETO_FLOW_SET_ISSUER_ETO_PREVIEW_CODE", { etoPreviewCode }),
  saveDataStart: (data: Partial<TGeneralEtoData>) =>
    createAction("ETO_FLOW_SAVE_DATA_START", { data }),
  changeBookBuildingStatus: (status: boolean) =>
    createAction("ETO_FLOW_CHANGE_BOOK_BUILDING_STATES", { status }),
  downloadBookBuildingStats: () => createSimpleAction("ETO_FLOW_DOWNLOAD_BOOK_BUILDING_STATS"),
  setNewStartDate: (newStartDate?: Date) =>
    createAction("ETO_FLOW_SET_START_DATE", { newStartDate }),
};
