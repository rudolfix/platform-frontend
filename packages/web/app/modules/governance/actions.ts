import { createActionFactory } from "@neufund/shared-utils";

import { IResolution } from "./types";

export const actions = {
  setGovernanceVisibility: createActionFactory(
    "SET_GOVERNANCE_VISIBILITY",
    (tabVisible: boolean) => ({ tabVisible }),
  ),
  setGovernanceResolutions: createActionFactory(
    "SET_GOVERNANCE_RESOLUTIONS",
    (resolutions: IResolution[]) => ({
      resolutions,
    }),
  ),
  loadGeneralInformationView: createActionFactory("LOAD_GENERAL_INFORMATION_VIEW"),
  toggleGovernanceUpdateModal: createActionFactory(
    "TOGGLE_GOVERNANCE_UPDATE_MODAL",
    (show: boolean) => ({ show }),
  ),
};
