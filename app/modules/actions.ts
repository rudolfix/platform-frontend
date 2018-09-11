import { TDictionaryValues } from "../types";
import { accessWalletActions } from "./accessWallet/actions";
import { authActions } from "./auth/actions";
import { dashboardActions } from "./dashboard/actions";
import { depositModalActions } from "./depositEthModal/actions";
import { etoDocumentsActions } from "./eto-documents/actions";
import { etoFlowActions } from "./eto-flow/actions";
import { etoActions } from "./eto/actions";
import { gasActions } from "./gas/actions";
import { genericModalActions } from "./genericModal/actions";
import { icbmWalletBalanceModalActions } from "./icbmWalletBalanceModal/actions";
import { immutableStorageActions } from "./immutableFile/actions";
import { initActions } from "./init/actions";
import { investmentFlowActions } from "./investmentFlow/actions";
import { kycActions } from "./kyc/actions";
import { notificationActions } from "./notifications/actions";
import { personProfileModalActions } from "./personProfileModal/actions";
import { routingActions } from "./routing/actions";
import { settingsActions } from "./settings/actions";
import { formSingleFileUploadActions } from "./shared/formSingleFileUpload/actions";
import { remoteFileActions } from "./shared/remoteFile/actions";
import { tokenPriceActions } from "./shared/tokenPrice/actions";
import { txMonitorActions } from "./tx/monitor/actions";
import { txSenderActions } from "./tx/sender/actions";
import { userAgentActions } from "./userAgent/actions";
import { verifyEmailActions } from "./verifyEmailWidget/actions";
import { videoModalActions } from "./videoModal/actions";
import { walletSelectorActions } from "./wallet-selector/actions";
import { walletActions } from "./wallet/actions";
import { web3Actions } from "./web3/actions";

/** You should add new actions also here (with a namespace).*/
export const actions = {
  dashboard: dashboardActions,
  settings: settingsActions,
  immutableStorage: immutableStorageActions,
  verifyEmail: verifyEmailActions,
  genericModal: genericModalActions,
  signMessageModal: accessWalletActions,
  tokenPrice: tokenPriceActions,
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
  etoDocuments: etoDocumentsActions,
  eto: etoActions,
  formSingleFileUpload: formSingleFileUploadActions,
  remoteFile: remoteFileActions,
  depositEthModal: depositModalActions,
  icbmWalletBalanceModal: icbmWalletBalanceModalActions,
  txMonitor: txMonitorActions,
  txSender: txSenderActions,
  gas: gasActions,
  investmentFlow: investmentFlowActions,
  videoModal: videoModalActions,
  personProfileModal: personProfileModalActions,
};

/**
 * Merge all actions into main action object. Add new set of actions here.
 */
export const allActions = {
  ...dashboardActions,
  ...tokenPriceActions,
  ...etoDocumentsActions,
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
  ...immutableStorageActions,
  ...etoFlowActions,
  ...etoActions,
  ...formSingleFileUploadActions,
  ...remoteFileActions,
  ...depositModalActions,
  ...txMonitorActions,
  ...txSenderActions,
  ...icbmWalletBalanceModalActions,
  ...gasActions,
  ...investmentFlowActions,
  ...videoModalActions,
  ...personProfileModalActions,
};

/**
 * Build action union type
 */
type TActionCreatorsUnionType = TDictionaryValues<typeof allActions>;
export type TAction = ReturnType<TActionCreatorsUnionType>;
export type TActionType = TAction["type"];
