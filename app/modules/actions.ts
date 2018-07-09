import { settingsActions } from "./settings/actions";
import { verifyEmailActions } from "./verifyEmailWidget/actions";

import { TDictionaryValues } from "../types";
import { accessWalletActions } from "./accessWallet/actions";
import { authActions } from "./auth/actions";
import { dashboardActions } from "./dashboard/actions";
import { etoFlowActions } from "./eto-flow/actions";
import { etoActions } from "./eto/actions";
import { genericModalActions } from "./genericModal/actions";
import { initActions } from "./init/actions";
import { kycActions } from "./kyc/actions";
import { notificationActions } from "./notifications/actions";
import { routingActions } from "./routing/actions";
import { formSingleFileUploadActions } from "./shared/formSingleFileUpload/actions";
import { remoteFileActions } from "./shared/remoteFile/actions";
import { userAgentActions } from "./userAgent/actions";
import { walletSelectorActions } from "./wallet-selector/actions";
import { walletActions } from "./wallet/actions";
import { web3Actions } from "./web3/actions";

/** You should add new actions also here (with a namespace).*/
export const actions = {
  dashboard: dashboardActions,
  settings: settingsActions,
  verifyEmail: verifyEmailActions,
  genericModal: genericModalActions,
  signMessageModal: accessWalletActions,
  init: initActions,
  kyc: kycActions,
  routing: routingActions,
  walletSelector: walletSelectorActions,
  web3: web3Actions,
  userAgent: userAgentActions,
  auth: authActions,
  wallet: walletActions,
  notifications: notificationActions,
  etoFlow: etoFlowActions,
  eto: etoActions,
  formSingleFileUpload: formSingleFileUploadActions,
  remoteFile: remoteFileActions,
};

/**
 * Merge all actions into main action object. Add new set of actions here.
 */
export const allActions = {
  ...dashboardActions,
  ...verifyEmailActions,
  ...settingsActions,
  ...genericModalActions,
  ...accessWalletActions,
  ...initActions,
  ...routingActions,
  ...kycActions,
  ...walletSelectorActions,
  ...web3Actions,
  ...userAgentActions,
  ...authActions,
  ...walletActions,
  ...notificationActions,
  ...etoFlowActions,
  ...etoActions,
  ...formSingleFileUploadActions,
  ...remoteFileActions,
};

/**
 * Build action union type
 */
type TActionCreatorsUnionType = TDictionaryValues<typeof allActions>;
export type TAction = ReturnType<TActionCreatorsUnionType>;
