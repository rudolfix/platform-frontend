import { connect, InferableComponentEnhancerWithProps, Options } from "react-redux";
import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { ILoadUserAgentInfoAction } from "./modules/userAgent/actions";
import { browserReducer } from "./modules/userAgent/reducer";
import { IBrowserWalletConnectionErrorAction } from "./modules/wallet-selector/browser-wizard/actions";
import { browserWalletWizardReducer } from "./modules/wallet-selector/browser-wizard/reducer";
import { ISetLedgerWizardAccountsAction } from "./modules/wallet-selector/ledger-wizard/actions";

import { ledgerWizardReducer } from "./modules/wallet-selector/ledger-wizard/reducer";
import {
  INewPersonalWalletPluggedAction,
  IPersonalWalletDisconnectedAction,
} from "./modules/web3/actions";
import { web3Reducer } from "./modules/web3/reducer";

import { TAction } from "./modules/actions";

export interface IAppAction {
  type: string;
  payload?: any;
}
export type ActionType<T extends IAppAction> = T["type"];
export type ActionPayload<T extends IAppAction> = T["payload"];

export type AppDispatch = (a: AppActionTypes | Function) => void;

export type AppReducer<S> = (state: Readonly<S> | undefined, action: AppActionTypes) => S;

// add new actions here
export type AppActionTypes =
  //ledger wallet
  | ISetLedgerWizardAccountsAction
  // browser wallet
  | IBrowserWalletConnectionErrorAction
  //web3 management
  | INewPersonalWalletPluggedAction
  | IPersonalWalletDisconnectedAction
  // browser
  | ILoadUserAgentInfoAction
  | TAction;

// add new app reducers here. They must be AppReducer<T> type
const appReducers = {
  ledgerWizardState: ledgerWizardReducer,
  browserWalletWizardState: browserWalletWizardReducer,
  web3State: web3Reducer,
  browser: browserReducer,
};

// add all custom reducers here
const allReducers = {
  ...appReducers,
  router: routerReducer,
};

// base on reducers we can infer type of app state
// this is a little bit ugly workaround because of typeof not being flexible enough
// related: https://github.com/Microsoft/TypeScript/issues/6606
type Reduced<T> = { [P in keyof T]: AppReducer<T[P]> };
function reducersToState<T>(o: Reduced<T>): T {
  return o as any;
}
// tslint:disable-next-line
const appStateInstance = (false ? undefined : reducersToState(appReducers))!;
export type IAppState = typeof appStateInstance;

export const reducers = combineReducers<IAppState>(allReducers);

interface IAppConnectOptions<S, D> {
  stateToProps?: (state: IAppState) => S;
  dispatchToProps?: (dispatch: AppDispatch) => D;
  options?: Options<IAppState, S, {}>;
}

// helper to use instead of redux connect. It's bound with our app state and it uses dictionary to pass arguments
export function appConnect<S = {}, D = {}>(
  config: IAppConnectOptions<S, D>,
): InferableComponentEnhancerWithProps<S & D, {}> {
  return connect<S, D, {}, IAppState>(
    config.stateToProps!,
    config.dispatchToProps!,
    undefined,
    config.options as any,
  );
}
