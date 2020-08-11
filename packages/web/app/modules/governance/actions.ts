import { createActionFactory } from "@neufund/shared-utils";

import { TResolution } from "./types";
import { TGovernanceViewState } from "./reducer";

export const actions = {
  setGovernanceVisibility: createActionFactory(
    "SET_GOVERNANCE_VISIBILITY",
    (tabVisible: boolean) => ({ tabVisible }),
  ),
  setGovernanceResolutions: createActionFactory(
    "SET_GOVERNANCE_RESOLUTIONS",
    (resolutions: TResolution[]) => ({
      resolutions,
    }),
  ),
  loadGeneralInformationView: createActionFactory("GOVERNANCE_LOAD_GENERAL_INFORMATION_VIEW"),
  closeGovernanceUpdateModal: createActionFactory("GOVERNANCE_CLOSE_GOVERNANCE_UPDATE_MODAL"),
  openGovernanceUpdateModal: createActionFactory("GOVERNANCE_OPEN_GOVERNANCE_UPDATE_MODAL"),
  setGovernanceUpdateData: createActionFactory(
    "setGovernanceUpdateData",
    (data: TGovernanceViewState) => ({
      data
    })
  ),
  uploadFile: createActionFactory(
    "GOVERNANCE_UPLOAD_FILE",
    (file: string) => ({ file })
  ),
  onFormChange: createActionFactory(
    "FORM_ON_CHANGE",
    (formId: string, fieldPath: string, newValue: string) => ({
      formId, fieldPath, newValue,
    }),
  ),
  onFormBlur: createActionFactory(
    "FORM_ON_BLUR",
    (formId: string, fieldPath: string, newValue: string) => ({
      formId, fieldPath, newValue,
    })
  ),
  onFormFocus: createActionFactory(
    "FORM_ON_FOCUS",
    (formId: string, fieldPath: string, newValue: string) => ({
      formId, fieldPath, newValue,
    })
  ),
};
