import { TResolutionData } from "@neufund/shared-modules";
import { createActionFactory } from "@neufund/shared-utils";

import { TDocumentUploadResponse, TGovernanceViewState, TResolution } from "./types";

export const actions = {
  setGovernanceVisibility: createActionFactory(
    "SET_GOVERNANCE_VISIBILITY",
    (tabVisible: boolean) => ({ tabVisible }),
  ),
  setGovernanceResolutions: createActionFactory(
    "SET_GOVERNANCE_RESOLUTIONS",
    (resolutions: TResolutionData[]) => ({
      resolutions,
    }),
  ),
  loadGeneralInformationView: createActionFactory("GOVERNANCE_LOAD_GENERAL_INFORMATION_VIEW"),
  closeGovernanceUpdateModal: createActionFactory("GOVERNANCE_CLOSE_GOVERNANCE_UPDATE_MODAL"),
  openGovernanceUpdateModal: createActionFactory("GOVERNANCE_OPEN_GOVERNANCE_UPDATE_MODAL"),
  setGovernanceUpdateData: createActionFactory(
    "setGovernanceUpdateData",
    (data: TGovernanceViewState) => ({
      data,
    }),
  ),
  uploadFile: createActionFactory("GOVERNANCE_UPLOAD_FILE", (file: File) => ({ file })),
  onFormChange: createActionFactory(
    "FORM_ON_CHANGE",
    (formId: string, fieldPath: string, newValue: string) => ({
      formId,
      fieldPath,
      newValue,
    }),
  ),
  onFormBlur: createActionFactory(
    "FORM_ON_BLUR",
    (formId: string, fieldPath: string, newValue: string) => ({
      formId,
      fieldPath,
      newValue,
    }),
  ),
  onFormFocus: createActionFactory(
    "FORM_ON_FOCUS",
    (formId: string, fieldPath: string, newValue: string) => ({
      formId,
      fieldPath,
      newValue,
    }),
  ),
  onFileUpload: createActionFactory("ON_FILE_UPLOAD", (response: TDocumentUploadResponse) => ({
    ...response,
  })),
  removeFile: createActionFactory("REMOVE_FILE"),
  onFileRemove: createActionFactory("ON_FILE_REMOVE"),
  publishUpdate: createActionFactory("START_PUBLISH_UPDATE"),
  updatePublishSuccess: createActionFactory("UPDATE_PUBLISH_SUCCESS"),
  downloadIpfsDocument: createActionFactory(
    "DOWNLOAD_IPFS_DOCUMENT",
    (documentHash: string, documentTitle: string) => ({ documentHash, documentTitle }),
  ),
  resolutionUpdateRequested: createActionFactory(
    "RESOLUTION_UPDATE_REQUESTED",
    (resolution: TResolution) => ({ resolution }),
  ),
  resolutionUpdateReceived: createActionFactory(
    "RESOLUTION_UPDATE_RECEIVED",
    (resolutions: TResolution[]) => ({ resolutions }),
  ),
};
