import { createActionFactory } from "@neufund/shared-utils";
import { match } from "react-router-dom";

import { TEtoViewByIdMatch, TEtoViewByPreviewCodeMatch } from "../../routing/types";

export const etoViewNotAuthActions = {
  loadNotAuthorizedEtoView: createActionFactory(
    "ETO_VIEW_LOAD_NOT_AUTH_ETO_VIEW",
    (previewCode: string, routeMatch: match<TEtoViewByPreviewCodeMatch>) => ({
      previewCode,
      routeMatch,
    }),
  ),
  loadNotAuthorizedEtoViewById: createActionFactory(
    "ETO_VIEW_LOAD_NOT_AUTH_ETO_VIEW_BY_ID",
    (etoId: string, routeMatch: match<TEtoViewByIdMatch>) => ({ etoId, routeMatch }),
  ),
};
