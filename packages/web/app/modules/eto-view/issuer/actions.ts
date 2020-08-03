import { EJurisdiction } from "@neufund/shared-modules";
import { createActionFactory } from "@neufund/shared-utils";
import { match } from "react-router-dom";

import { TEtoViewByIdMatch } from "../../routing/types";

export const EtoViewIssuerActions = {
  loadIssuerEtoView: createActionFactory("ETO_VIEW_LOAD_ISSUER_ETO_VIEW"),
  loadIssuerPreviewEtoView: createActionFactory(
    "ETO_VIEW_LOAD_ISSUER_ETO_PREVIEW",
    (previewCode: string, routeMatch: match<{ jurisdiction: EJurisdiction }>) => ({
      previewCode,
      routeMatch,
    }),
  ),
  loadIssuerPreviewEtoViewById: createActionFactory(
    "ETO_VIEW_LOAD_ISSUER_ETO_PREVIEW_BY_ID",
    (etoId: string, routeMatch: match<TEtoViewByIdMatch>) => ({
      etoId,
      routeMatch,
    }),
  ),
};
