import { connect, InferableComponentEnhancerWithProps, Options } from "react-redux";
import { LocationChangeAction, routerReducer, RouterState } from "react-router-redux";
import { combineReducers } from "redux";

import { authReducer } from "./modules/auth/reducer";
import { genericErrorModalReducer } from "./modules/genericErrorModal/reducer";
import { initReducer } from "./modules/init/reducer";
import { kycReducer } from "./modules/kyc/reducer";
import { moneyReducer } from "./modules/money/reducer";
import { notificationsReducer } from "./modules/notifications/reducer";
import { showSeedModalReducer } from "./modules/showSeedModal/reducer";
import { signMessageModalReducer } from "./modules/signMessageModal/reducer";
import { browserReducer } from "./modules/userAgent/reducer";
import { browserWalletWizardReducer } from "./modules/wallet-selector/browser-wizard/reducer";
import { ledgerWizardReducer } from "./modules/wallet-selector/ledger-wizard/reducer";
import { lightWalletWizardReducer } from "./modules/wallet-selector/light-wizard/reducer";
import { walletSelectorReducer } from "./modules/wallet-selector/reducer";
import { walletReducer } from "./modules/wallet/reducer";
import { web3Reducer } from "./modules/web3/reducer";

import { TAction } from "./modules/actions";
import { FunctionWithDeps } from "./types";

export interface IAppAction {
  type: string;
  payload?: any;
}
export type ActionType<T extends IAppAction> = T["type"];
export type ActionPayload<T extends IAppAction> = T["payload"];

export type AppDispatch = (a: AppActionTypes | FunctionWithDeps) => void;

export type AppReducer<S> = (state: Readonly<S> | undefined, action: AppActionTypes) => S;

type TRouterActions = LocationChangeAction;

// add new external actions here
export type AppActionTypes = TAction | TRouterActions;

// add new app reducers here. They must be AppReducer<T> type
const appReducers = {
  ledgerWizardState: ledgerWizardReducer,
  browserWalletWizardState: browserWalletWizardReducer,
  web3State: web3Reducer,
  browser: browserReducer,
  walletSelector: walletSelectorReducer,
  auth: authReducer,
  genericErrorModal: genericErrorModalReducer,
  signMessageModal: signMessageModalReducer,
  showSeedModal: showSeedModalReducer,
  kyc: kycReducer,
  init: initReducer,
  lightWalletWizard: lightWalletWizardReducer,
  money: moneyReducer,
  wallet: walletReducer,
  notifications: notificationsReducer,
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
export type IAppState = typeof appStateInstance & {
  router: RouterState;
};

export const reducers = combineReducers<IAppState>(allReducers);

interface IAppConnectOptions<S, D, O> {
  stateToProps?: (state: IAppState, ownProps: O) => S;
  dispatchToProps?: (dispatch: AppDispatch, ownProps: O) => D;
  options?: Options<IAppState, S, {}>;
}

// helper to use instead of redux connect. It's bound with our app state and it uses dictionary to pass arguments
export function appConnect<S = {}, D = {}, O = {}>(
  config: IAppConnectOptions<S, D, O>,
): InferableComponentEnhancerWithProps<S & D, O> {
  return connect<S, D, O, IAppState>(
    config.stateToProps!,
    config.dispatchToProps!,
    undefined,
    config.options as any,
  );
}
