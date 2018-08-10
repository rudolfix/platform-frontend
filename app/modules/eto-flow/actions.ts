import { TGeneralEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { IEtoDocument, IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

export const etoFlowActions = {
  // Company & ETO API
  loadDataStart: () => createSimpleAction("ETO_FLOW_LOAD_DATA_START"),
  submitDataStart: () => createSimpleAction("ETO_FLOW_SUBMIT_DATA_START"),
  loadData: (data: Partial<TGeneralEtoData>) => createAction("ETO_FLOW_LOAD_DATA", { data }),
  saveDataStart: (data: Partial<TGeneralEtoData>) =>
    createAction("ETO_FLOW_SAVE_DATA_START", { data }),
  // ETO File API
  loadFileDataStart: () => createSimpleAction("ETO_FLOW_LOAD_FILE_DATA_START"),
  loadEtoFileData: (data: IEtoFiles) => createAction("ETO_FLOW_LOAD_ETO_FILE_DATA", { data }),
  generateTemplate: (immutableFileId: IEtoDocument) =>
    createAction("ETO_FLOW_GENERATE_TEMPLATE", { immutableFileId }),
  etoUploadDocument: (file: File, document: IEtoDocument) =>
    createAction("ETO_FLOW_UPLOAD_DOCUMENT_START", { file, document }),
  showIpfsModal: (fileUploadAction: () => void) =>
    createAction("ETO_FLOW_IPFS_MODAL_SHOW", { fileUploadAction }),
  hideIpfsModal: () => createSimpleAction("ETO_FLOW_IPFS_MODAL_HIDE"),
};
