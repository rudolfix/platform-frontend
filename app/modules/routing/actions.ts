import { createAction } from "../actionsUtils";

import { push } from "react-router-redux";
import { appRoutes } from "../../components/AppRouter";
import { kycRoutes } from "../../components/kyc/routes";
import { recoverRoutes } from "../../components/walletSelector/walletRecover/recoverRoutes";

const createRoutingAction = (path: string) => push(path);

export const routingActions = {
  // navigation primitives
  goBack: () => createAction("GO_BACK", {}),
  goTo: (absolutePath: string) => createRoutingAction(absolutePath),

  // default routes
  goHome: () => createRoutingAction("/"),

  //kyc routes
  goToKYCHome: () => createRoutingAction(kycRoutes.start),
  goToKYCPersonalStart: () => createRoutingAction(kycRoutes.personalStart),
  goToKYCPersonalInstantId: () => createRoutingAction(kycRoutes.personalInstantId),
  goToKYCManualVerification: () => createRoutingAction(kycRoutes.personalManualVerification),
  goToKYCManualVerificationIDUpload: () => createRoutingAction(kycRoutes.personalIDUpload),
  goToKYCPersonalDone: () => createRoutingAction(kycRoutes.personalDone),

  goToKYCCompanyStart: () => createRoutingAction(kycRoutes.companyStart),
  goToKYCCompanyDone: () => createRoutingAction(kycRoutes.companyDone),

  // dashboard
  goToDashboard: () => createRoutingAction(appRoutes.dashboard),

  // registration
  goToRegister: () => createRoutingAction(appRoutes.register),

  // Successful password recovery
  goToSuccessfulRecovery: () => createRoutingAction(recoverRoutes.success),

  // other...
};
