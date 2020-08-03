import { createActionFactory } from "@neufund/shared-utils";
import { match } from "react-router-dom";

export const EtoViewNomineeActions = {
  loadNomineeEtoView: createActionFactory(
    "ETO_VIEW_LOAD_NOMINEE_ETO_VIEW",
    (routeMatch: match<{}>) => ({ routeMatch }),
  ),
};
