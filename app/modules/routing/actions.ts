import { createAction } from "../actions";

import { kycRoutes } from "../../components/Kyc/routes";

const createRoutingAction = (path: string) => createAction("GO_TO_ROUTE", { path });

export const routingActions = {
  // navigate back
  goBack: () => createAction("GO_BACK", {}),

  // default routes
  goHome: () => createRoutingAction("/"),

  //kyc routes
  goToKYCHome: () => createRoutingAction(kycRoutes.start),
  goToKYCStartPrivateFlow: () => createRoutingAction(kycRoutes.privateStart),
  goToKYCStartCompanyFlow: () => createRoutingAction(kycRoutes.companyStart),

  // other...
};
