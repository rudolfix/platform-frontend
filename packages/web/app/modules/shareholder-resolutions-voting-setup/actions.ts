import { TResolutionDocument } from "@neufund/shared-modules";
import { createActionFactory } from "@neufund/shared-utils";

export const actions = {
  getShareCapital: createActionFactory("GET_SHARE_CAPITAL"),
  setShareCapital: createActionFactory("SET_SHARE_CAPITAL", (shareCapital: string) => ({
    shareCapital,
  })),
  uploadResolutionDocument: createActionFactory("UPLOAD_RESOLUTION_DOCUMENT", (file: File) => ({
    file,
  })),
  uploadResolutionDocumentSuccess: createActionFactory(
    "UPLOAD_RESOLUTION_DOCUMENT_SUCCESS",
    (resolutionDocument: TResolutionDocument) => resolutionDocument,
  ),
  uploadResolutionDocumentError: createActionFactory(
    "UPLOAD_RESOLUTION_DOCUMENT_ERROR",
    (tabVisible: boolean) => ({ tabVisible }),
  ),
  removeUploadedDocument: createActionFactory("REMOVE_UPLOADED_RESOLUTION_DOCUMENT"),
  showSuccessModal: createActionFactory("SHOW_SUCCESS_MODAL"),
  closeSuccessModal: createActionFactory("CLOSE_SUCCESS_MODAL"),
};
