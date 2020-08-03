import { EJurisdiction } from "@neufund/shared-modules";

import { ELogoutReason } from "../auth/types";

export type TLoginRouterState = { logoutReason: ELogoutReason } | undefined;
export type TEtoViewByPreviewCodeMatch = { jurisdiction: EJurisdiction; previewCode: string };
export type TEtoViewByIdMatch = { jurisdiction: EJurisdiction; etoId: string };
export type TEtoIssuerPreviewMatch = { previewCode: string };
export type TEtoPublicViewLegacyRouteMatch = { preveiwCode: string };
export type TEtoPublicViewByIdLegacyRoute = { etoId: string };
export type TShareholderResolutionsVotingRoute = { proposalId: string };
