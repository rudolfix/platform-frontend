import { push } from "connected-react-router";
import { LocationDescriptorObject, Path } from "history";

import { appRoutes } from "../../components/appRoutes";
import { kycRoutes } from "../../components/kyc/routes";
import { recoverRoutes } from "../../components/wallet-selector/wallet-recover/router/recoverRoutes";
import { walletRoutes } from "../../components/wallet/routes";
import { createAction } from "../actionsUtils";

const createRoutingAction = (location: Path | LocationDescriptorObject) => push(location as any);

export const routingActions = {
  // navigation primitives
  goBack: () => createAction("GO_BACK", {}),
  goTo: (location: Path | LocationDescriptorObject) => createRoutingAction(location),

  // default routes
  goHome: () => createRoutingAction(appRoutes.root),
  goEtoHome: () => createRoutingAction(appRoutes.etoLanding),

  //kyc routes
  goToKYCHome: () => createRoutingAction(kycRoutes.start),
  goToKYCIndividualStart: () => createRoutingAction(kycRoutes.individualStart),
  goToKYCIndividualDocumentVerification: () =>
    createRoutingAction(kycRoutes.individualDocumentVerification),
  goToKYCIndividualUpload: () => createRoutingAction(kycRoutes.individualUpload),

  goToKYCLegalRepresentative: () => createRoutingAction(kycRoutes.legalRepresentative),
  goToKYCBusinessData: () => createRoutingAction(kycRoutes.businessData),
  goToKYCBeneficialOwners: () => createRoutingAction(kycRoutes.beneficialOwners),

  // dashboard
  goToDashboard: () => createRoutingAction(appRoutes.dashboard),
  goToProfile: () => createRoutingAction(appRoutes.profile),

  // registration
  goToRegister: () => createRoutingAction(appRoutes.register),

  // login
  goToLogin: () => createRoutingAction(appRoutes.login),
  goToEtoLogin: () => createRoutingAction(appRoutes.loginEto),

  // Successful password recovery
  goToSuccessfulRecovery: () => createRoutingAction(recoverRoutes.success),

  // wallet
  goToWallet: () => createRoutingAction(appRoutes.wallet),

  // deposit founds
  goToDepositEuroToken: () => createRoutingAction(walletRoutes.euroToken),
  goToDepositEth: () => createRoutingAction(walletRoutes.eth),

  // external paths
  openInNewWindow: (path: string, target: string = "_blank") =>
    createAction("@@router/OPEN_IN_NEW_WINDOW", { path, target }),

  // Portfolio
  goToPortfolio: () => createRoutingAction(appRoutes.portfolio),

  // other...
};
