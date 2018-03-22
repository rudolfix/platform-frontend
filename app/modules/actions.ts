import { values } from "lodash";
import { settingsActions } from "./settings/actions";

import { authActions } from "./auth/actions";
import { dashboardActions } from "./dashboard/actions";
import { genericErrorModalActions } from "./genericErrorModal/actions";
import { initActions } from "./init/actions";
import { kycActions } from "./kyc/actions";
import { routingActions } from "./routing/actions";
import { showSeedModalActions } from "./showSeedModal/actions";
import { signMessageModalActions } from "./signMessageModal/actions";
import { userAgentActions } from "./userAgent/actions";
import { walletSelectorActions } from "./wallet-selector/actions";
import { walletActions } from "./wallet/actions";
import { web3Actions } from "./web3/actions";

/** You should add new actions also here (with a namespace).*/
export const actions = {
  dashboard: dashboardActions,
  settings: settingsActions,
  signMessageModal: signMessageModalActions,
  showSeedModal: showSeedModalActions,
  genericErrorModal: genericErrorModalActions,
  init: initActions,
  kyc: kycActions,
  routing: routingActions,
  walletSelector: walletSelectorActions,
  web3: web3Actions,
  userAgent: userAgentActions,
  auth: authActions,
  wallet: walletActions,
};

/**
 * Merge all actions into main action object. Add new set of actions here.
 */
export const allActions = {
  ...dashboardActions,
  ...settingsActions,
  ...signMessageModalActions,
  ...showSeedModalActions,
  ...genericErrorModalActions,
  ...initActions,
  ...routingActions,
  ...kycActions,
  ...walletSelectorActions,
  ...web3Actions,
  ...userAgentActions,
  ...authActions,
  ...walletActions,
};

/**
 * Build action union type
 */
export const returnTypeOf = <RT extends {}>(_expression: (...params: any[]) => RT): RT => {
  return ({} as any) as RT;
};

const actionList = values(allActions).map(returnTypeOf);
export type TAction = typeof actionList[number];
