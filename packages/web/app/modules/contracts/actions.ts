import { createActionFactory } from "@neufund/shared-utils";

import { IPlatformTermsConstants } from "./reducer";

export const contractsActions = {
  setPlatformTermConstants: createActionFactory(
    "CONTRACTS_SET_PLATFORM_TERM_CONSTANTS",
    (platformTermsConstants: IPlatformTermsConstants) => ({ platformTermsConstants }),
  ),
};
