import { connect, InferableComponentEnhancerWithProps } from "react-redux";
import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { IBrowserWalletConnectionErrorAction } from "./modules/wallet-selector/browser-wizard/actions";
import {
  browserWalletWizardReducer,
  IBrowserWalletWizardState,
} from "./modules/wallet-selector/browser-wizard/reducer";
import {
  ILedgerConnectionEstablishedAction,
  ILedgerConnectionEstablishedErrorAction,
  ILedgerWizardAccountsListNextPage,
  ILedgerWizardAccountsListPreviousPage,
  ISetLedgerWizardAccountsAction,
} from "./modules/wallet-selector/ledger-wizard/actions";
import {
  ILedgerWizardState,
  ledgerWizardReducer,
} from "./modules/wallet-selector/ledger-wizard/reducer";

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
  | ILedgerConnectionEstablishedAction
  | ILedgerConnectionEstablishedErrorAction
  | ISetLedgerWizardAccountsAction
  | ILedgerWizardAccountsListNextPage
  | ILedgerWizardAccountsListPreviousPage
  // browser wallet
  | IBrowserWalletConnectionErrorAction;

export interface IAppState {
  ledgerWizardState: ILedgerWizardState;
  browserWalletWizardState: IBrowserWalletWizardState;
}

export const reducers = combineReducers<IAppState>({
  ledgerWizardState: ledgerWizardReducer,
  browserWalletWizardState: browserWalletWizardReducer,
  router: routerReducer,
});

interface IAppConnectOptions<S, D> {
  stateToProps?: (state: IAppState) => S;
  dispatchToProps?: (dispatch: AppDispatch) => D;
}

export function appConnect<S = {}, D = {}>(
  options: IAppConnectOptions<S, D>,
): InferableComponentEnhancerWithProps<S & D, {}> {
  return connect<S, D, {}, IAppState>(options.stateToProps!, options.dispatchToProps!);
}
