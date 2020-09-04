import { createActionFactory } from "@neufund/shared-utils";

export const actions = {
  uploadResolutionDocument: createActionFactory(
    "UPLOAD_RESOLUTION_DOCUMENT",
    (tabVisible: boolean) => ({ tabVisible }),
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
