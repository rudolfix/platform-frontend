import { values } from "lodash";
import { settingsActions } from "./settings/actions";

import { accessWalletActions } from "./accessWallet/actions";
import { authActions } from "./auth/actions";
import { dashboardActions } from "./dashboard/actions";
import { genericErrorModalActions } from "./genericErrorModal/actions";
import { initActions } from "./init/actions";
import { kycActions } from "./kyc/actions";
import { routingActions } from "./routing/actions";
import { showSeedModalActions } from "./showSeedModal/actions";
import { userAgentActions } from "./userAgent/actions";
import { walletActions } from "./wallet-selector/actions";
import { web3Actions } from "./web3/actions";

/** You should add new actions also here (with a namespace).*/
export const actions = {
  dashboard: dashboardActions,
  settings: settingsActions,
  signMessageModal: accessWalletActions,
  showSeedModal: showSeedModalActions,
  genericErrorModal: genericErrorModalActions,
  init: initActions,
  kyc: kycActions,
  routing: routingActions,
  wallet: walletActions,
  web3: web3Actions,
  userAgent: userAgentActions,
  auth: authActions,
};

/**
 * Merge all actions into main action object. Add new set of actions here.
 */
export const allActions = {
  ...dashboardActions,
  ...settingsActions,
  ...accessWalletActions,
  ...showSeedModalActions,
  ...genericErrorModalActions,
  ...initActions,
  ...routingActions,
  ...kycActions,
  ...walletActions,
  ...web3Actions,
  ...userAgentActions,
  ...authActions,
};

/**
 * Build action union type
 */
export const returnTypeOf = <RT extends {}>(_expression: (...params: any[]) => RT): RT => {
  return ({} as any) as RT;
};

const actionList = values(allActions).map(returnTypeOf);
export type TAction = typeof actionList[number];
