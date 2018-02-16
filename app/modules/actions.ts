import { values } from "lodash";

import { kycActions } from "./kyc/actions";
import { routingActions } from "./routing/actions";
import { walletActions } from "./wallet-selector/actions";

export const actions = {
  kyc: kycActions,
  routing: routingActions,
  wallet: walletActions,
};

/**
 * Merge all actions into main action object
 */
const allActions = {
  ...routingActions,
  ...kycActions,
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

/**
 * action creators
 */
export const createAction = <T extends string, P extends {}>(type: T, payload: P) => {
  return { type, payload };
};

export const createSimpleAction = <T extends string>(type: T) => {
  return { type };
};
