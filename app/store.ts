import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";
import {
  counterReducer,
  ICounterDecrementAction,
  ICounterIncrementAction,
  ICounterState,
} from "./modules/counter/index";
import {
  ILedgerConnectionEstablishedAction,
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
  | ICounterIncrementAction
  | ICounterDecrementAction
  //ledger
  | ILedgerConnectionEstablishedAction
  | ISetLedgerWizardAccountsAction
  | ILedgerWizardAccountsListNextPage
  | ILedgerWizardAccountsListPreviousPage;

export interface IAppState {
  counterState: ICounterState;
  ledgerWizardState: ILedgerWizardState;
}

export const reducers = combineReducers<IAppState>({
  counterState: counterReducer,
  ledgerWizardState: ledgerWizardReducer,
  router: routerReducer,
});
