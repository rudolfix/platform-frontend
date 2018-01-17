import { toPairs, zip } from "lodash";

import { pairZip } from "../../../../typings/modifications";
import { DispatchSymbol, GetState, GetStateSymbol } from "../../../getContainer";
import { injectableFn } from "../../../redux-injectify";
import { AppDispatch, IAppAction } from "../../../store";
import { makeActionCreator, makeParameterlessActionCreator } from "../../../storeHelpers";
import { LedgerConnector, LedgerConnectorSymbol } from "../../web3/LedgerConnector";
import { Web3Manager, Web3ManagerSymbol } from "../../web3/Web3Manager";
import { ILedgerAccount } from "./reducer";

export interface ILedgerConnectionEstablishedAction extends IAppAction {
  type: "LEDGER_CONNECTION_ESTABLISHED";
}

export interface ISetLedgerWizardAccountsAction extends IAppAction {
  type: "SET_LEDGER_WIZARD_ACCOUNTS";
  payload: {
    accounts: ILedgerAccount[];
  };
}

export interface ILedgerWizardAccountsListNextPage extends IAppAction {
  type: "LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE";
}

export interface ILedgerWizardAccountsListPreviousPage extends IAppAction {
  type: "LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE";
}

export const ledgerConnectionEstablishedAction = makeParameterlessActionCreator<
  ILedgerConnectionEstablishedAction
>("LEDGER_CONNECTION_ESTABLISHED");

export const setLedgerAccountsAction = makeActionCreator<ISetLedgerWizardAccountsAction>(
  "SET_LEDGER_WIZARD_ACCOUNTS",
);

export const ledgerWizardAccountsListNextPageAction = makeParameterlessActionCreator<
  ILedgerWizardAccountsListNextPage
>("LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE");

export const ledgerWizardAccountsListPreviousPageAction = makeParameterlessActionCreator<
  ILedgerWizardAccountsListPreviousPage
>("LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE");

export const tryEstablishingConnectionWithLedger = injectableFn(
  async (dispatch: AppDispatch, ledgerConnector: LedgerConnector, web3Manager: Web3Manager) => {
    await ledgerConnector.connect(web3Manager.networkId);

    dispatch(ledgerConnectionEstablishedAction());
  },
  [DispatchSymbol, LedgerConnectorSymbol, Web3ManagerSymbol],
);

export const loadLedgerAccountsAction = injectableFn(
  async (
    dispatch: AppDispatch,
    getState: GetState,
    ledgerConnector: LedgerConnector,
    web3Manager: Web3Manager,
  ) => {
    const { index, numberOfAccountsPerPage, derivationPathPrefix } = getState().ledgerWizardState;

    const derivationPathToAddressMap = await ledgerConnector.getMultipleAccounts(
      derivationPathPrefix,
      index,
      numberOfAccountsPerPage,
    );

    const derivationPathsArray = toPairs<string>(derivationPathToAddressMap).map(pair => ({
      derivationPath: pair[0],
      address: pair[1],
    }));

    const balances = await Promise.all(
      derivationPathsArray.map(dp =>
        web3Manager.internalWeb3Adapter.getBalance(dp.address).then(bn => bn.toString()),
      ),
    );

    const accounts = (zip as pairZip)(derivationPathsArray, balances).map(([dp, balance]) => ({
      ...dp,
      balance,
    }));

    dispatch(setLedgerAccountsAction({ accounts }));
  },
  [DispatchSymbol, GetStateSymbol, LedgerConnectorSymbol, Web3ManagerSymbol],
);

export const goToNextPageAndLoadDataAction = injectableFn(
  (dispatch: AppDispatch) => {
    dispatch(ledgerWizardAccountsListNextPageAction());
    return dispatch(loadLedgerAccountsAction);
  },
  [DispatchSymbol],
);

export const goToPreviousPageAndLoadDataAction = injectableFn(
  (dispatch: AppDispatch) => {
    dispatch(ledgerWizardAccountsListPreviousPageAction());
    return dispatch(loadLedgerAccountsAction);
  },
  [DispatchSymbol],
);
