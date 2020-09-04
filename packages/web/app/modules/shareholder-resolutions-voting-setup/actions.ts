import { createActionFactory } from "@neufund/shared-utils";

export const actions = {
  uploadResolutionDocument: createActionFactory(
    "UPLOAD_RESOLUTION_DOCUMENT",
    (file: File) => ({ file }),
  ),
  uploadResolutionDocumentSuccess: createActionFactory(
    "UPLOAD_RESOLUTION_DOCUMENT_SUCCESS",
    (tabVisible: boolean) => ({ tabVisible }),
  ),
  uploadResolutionDocumentError: createActionFactory(
    "UPLOAD_RESOLUTION_DOCUMENT_ERROR",
    (tabVisible: boolean) => ({ tabVisible }),
  ),
}
