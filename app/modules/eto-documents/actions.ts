import { etoDocumentType, IEtoDocument, IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

export const etoDocumentsActions = {
  loadFileDataStart: () => createSimpleAction("ETO_DOCUMENTS_LOAD_FILE_DATA_START"),
  loadEtoFileData: (data: IEtoFiles) => createAction("ETO_DOCUMENTS_LOAD_ETO_FILE_DATA", { data }),
  generateTemplate: (immutableFileId: IEtoDocument) =>
    createAction("ETO_DOCUMENTS_GENERATE_TEMPLATE", { immutableFileId }),
  etoUploadDocument: (file: File, documentType: etoDocumentType) =>
    createAction("ETO_DOCUMENTS_UPLOAD_DOCUMENT_START", { file, documentType }),
  showIpfsModal: (fileUploadAction: () => void) =>
    createAction("ETO_DOCUMENTS_IPFS_MODAL_SHOW", { fileUploadAction }),
  hideIpfsModal: () => createSimpleAction("ETO_DOCUMENTS_IPFS_MODAL_HIDE"),
  downloadDocumentByType: (documentType: etoDocumentType) =>
    createAction("ETO_DOCUMENTS_DOWNLOAD_BY_TYPE", { documentType }),
};
