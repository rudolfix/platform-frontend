import { values } from "lodash";

import { kycActions } from "./kyc/actions";
import { routingActions } from "./routing/actions";
import { walletActions } from "./wallet-selector/actions";
import { web3Actions } from "./web3/actions";

export const actions = {
  kyc: kycActions,
  routing: routingActions,
  wallet: walletActions,
  web3: web3Actions,
};

/**
 * Merge all actions into main action object
 */
const allActions = {
  ...routingActions,
  ...kycActions,
  ...walletActions,
  ...web3Actions,
};

/**
 * Build action union type
 */
export const returnTypeOf = <RT extends {}>(_expression: (...params: any[]) => RT): RT => {
  return ({} as any) as RT;
};

const actionList = values(allActions).map(returnTypeOf);
export type TAction = typeof actionList[number];
