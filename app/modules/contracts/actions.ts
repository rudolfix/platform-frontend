import { createAction } from "../actionsUtils";
import { IPlatformTermsConstants } from "./reducer";

export const contractsActions = {
  setPlatformTermConstants: (platformTermsConstants: IPlatformTermsConstants) =>
    createAction("CONTRACTS_SET_PLATFORM_TERM_CONSTANTS", { platformTermsConstants }),
};
