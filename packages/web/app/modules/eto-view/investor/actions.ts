import { EJurisdiction } from "@neufund/shared-modules";
import { createActionFactory } from "@neufund/shared-utils";
import { match } from "react-router-dom";

import { TEtoViewByIdMatch } from "../../routing/types";

export const etoViewInvestorActions = {
  loadInvestorEtoView: createActionFactory(
    "ETO_VIEW_LOAD_INVESTOR_ETO_VIEW",
    (previewCode: string, routeMatch: match<{ jurisdiction: EJurisdiction }>) => ({
      previewCode,
      routeMatch,
    }),
  ),
  loadInvestorEtoViewById: createActionFactory(
    "ETO_VIEW_LOAD_INVESTOR_ETO_VIEW_BY_ID",
    (etoId: string, routeMatch: match<TEtoViewByIdMatch>) => ({ etoId, routeMatch }),
  ),
};
