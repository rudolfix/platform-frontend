import { toPairs, zip } from "lodash";

import { pairZip } from "../../../../typings/modifications";
import { APP_DISPATCH_SYMBOL, GET_STATE_SYMBOL, GetState } from "../../../getContainer";
import { injectableFn } from "../../../redux-injectify";
import { AppDispatch, IAppAction } from "../../../store";
import { makeActionCreator, makeParameterlessActionCreator } from "../../../storeHelpers";
import {
  LEDGER_WALLET_CONNECTOR_SYMBOL,
  LedgerLockedError,
  LedgerNotAvailableError,
  LedgerWalletConnector,
} from "../../web3/LedgerWallet";
import { WEB3_MANAGER_SYMBOL, Web3Manager } from "../../web3/Web3Manager";
import { walletConnectedAction } from "../actions";
import { ILedgerAccount } from "./reducer";

export const LEDGER_WIZARD_SIMPLE_DERIVATION_PATHS = ["44'/60'/1'/0", "44'/60'/0'/0"]; // TODO this should be taken from config

export interface ILedgerConnectionEstablishedAction extends IAppAction {
  type: "LEDGER_CONNECTION_ESTABLISHED";
}

export interface ILedgerConnectionEstablishedErrorAction extends IAppAction {
  type: "LEDGER_CONNECTION_ESTABLISHED_ERROR";
  payload: {
    errorMsg: string;
  };
}

export interface ISetLedgerWizardDerivationPathPrefixAction extends IAppAction {
  type: "SET_LEDGER_WIZARD_DERIVATION_PATH_PREFIX";
  payload: {
    derivationPathPrefix: string;
  };
}

export interface ILedgerWizardDerivationPathPrefixErrorAction extends IAppAction {
  type: "LEDGER_WIZARD_DERIVATION_PATH_PREFIX_ERROR";
}

export interface ISetLedgerWizardAccountsAction extends IAppAction {
  type: "SET_LEDGER_WIZARD_ACCOUNTS";
  payload: {
    accounts: ILedgerAccount[];
    derivationPathPrefix: string; // TODO: this should be optional as for case of predefined accounts we are not using it
  };
}

export interface ILedgerWizardAccountsListNextPage extends IAppAction {
  type: "LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE";
}

export interface ILedgerWizardAccountsListPreviousPage extends IAppAction {
  type: "LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE";
}

export interface IToggleLedgerWizardAdvancedAction extends IAppAction {
  type: "TOGGLE_LEDGER_WIZARD_ADVANCED";
}

export const ledgerConnectionEstablishedAction = makeParameterlessActionCreator<
  ILedgerConnectionEstablishedAction
>("LEDGER_CONNECTION_ESTABLISHED");

export const ledgerConnectionEstablishedErrorAction = makeActionCreator<
  ILedgerConnectionEstablishedErrorAction
>("LEDGER_CONNECTION_ESTABLISHED_ERROR");

export const setLedgerWizardDerivationPathPrefixAction = makeActionCreator<
  ISetLedgerWizardDerivationPathPrefixAction
>("SET_LEDGER_WIZARD_DERIVATION_PATH_PREFIX");

export const ledgerWizardDerivationPathPrefixErrorAction = makeParameterlessActionCreator<
  ILedgerWizardDerivationPathPrefixErrorAction
>("LEDGER_WIZARD_DERIVATION_PATH_PREFIX_ERROR");

export const setLedgerAccountsAction = makeActionCreator<ISetLedgerWizardAccountsAction>(
  "SET_LEDGER_WIZARD_ACCOUNTS",
);

export const ledgerWizardAccountsListNextPageAction = makeParameterlessActionCreator<
  ILedgerWizardAccountsListNextPage
>("LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE");

export const ledgerWizardAccountsListPreviousPageAction = makeParameterlessActionCreator<
  ILedgerWizardAccountsListPreviousPage
>("LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE");

export const toggleLedgerAccountsAdvancedAction = makeParameterlessActionCreator<
  IToggleLedgerWizardAdvancedAction
>("TOGGLE_LEDGER_WIZARD_ADVANCED");

function mapLedgerErrorToErrorMessage(error: Error): string {
  if (error instanceof LedgerLockedError) {
    return "Nano Ledger S is locked";
  }
  return "Nano Ledger S not available";
}

export const tryEstablishingConnectionWithLedger = injectableFn(
  async (
    dispatch: AppDispatch,
    ledgerWalletConnector: LedgerWalletConnector,
    web3Manager: Web3Manager,
  ) => {
    try {
      await ledgerWalletConnector.connect(web3Manager.networkId);

      dispatch(ledgerConnectionEstablishedAction());
    } catch (e) {
      dispatch(
        ledgerConnectionEstablishedErrorAction({ errorMsg: mapLedgerErrorToErrorMessage(e) }),
      );
    }
  },
  [APP_DISPATCH_SYMBOL, LEDGER_WALLET_CONNECTOR_SYMBOL, WEB3_MANAGER_SYMBOL],
);

export const loadLedgerAccountsAction = injectableFn(
  async (
    dispatch: AppDispatch,
    getState: GetState,
    ledgerConnector: LedgerWalletConnector,
    web3Manager: Web3Manager,
  ) => {
    const {
      advanced,
      index,
      numberOfAccountsPerPage,
      derivationPathPrefix,
    } = getState().ledgerWizardState;

    const derivationPathToAddressMap = advanced
      ? await ledgerConnector.getMultipleAccountsFromDerivationPrefix(
          derivationPathPrefix,
          index,
          numberOfAccountsPerPage,
        )
      : await ledgerConnector.getMultipleAccounts(LEDGER_WIZARD_SIMPLE_DERIVATION_PATHS);

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
      balanceETH: balance,
      balanceNEU: "0",
    }));

    dispatch(setLedgerAccountsAction({ accounts, derivationPathPrefix }));
  },
  [APP_DISPATCH_SYMBOL, GET_STATE_SYMBOL, LEDGER_WALLET_CONNECTOR_SYMBOL, WEB3_MANAGER_SYMBOL],
);

export const setDerivationPathPrefixAction = (derivationPathPrefix: string) =>
  injectableFn(
    async (dispatch: AppDispatch, getState: GetState) => {
      const currDp = getState().ledgerWizardState.derivationPathPrefix;

      if (currDp !== derivationPathPrefix) {
        dispatch(setLedgerWizardDerivationPathPrefixAction({ derivationPathPrefix }));
        dispatch(loadLedgerAccountsAction);
      }
    },
    [APP_DISPATCH_SYMBOL, GET_STATE_SYMBOL],
  );

export const goToNextPageAndLoadDataAction = injectableFn(
  (dispatch: AppDispatch) => {
    dispatch(ledgerWizardAccountsListNextPageAction());
    return dispatch(loadLedgerAccountsAction);
  },
  [APP_DISPATCH_SYMBOL],
);

export const goToPreviousPageAndLoadDataAction = injectableFn(
  (dispatch: AppDispatch) => {
    dispatch(ledgerWizardAccountsListPreviousPageAction());
    return dispatch(loadLedgerAccountsAction);
  },
  [APP_DISPATCH_SYMBOL],
);

export const finishSettingUpLedgerConnectorAction = (derivationPath: string) =>
  injectableFn(
    async (
      dispatch: AppDispatch,
      ledgerConnector: LedgerWalletConnector,
      web3Manager: Web3Manager,
    ) => {
      const ledgerWallet = await ledgerConnector.finishConnecting(derivationPath);
      await web3Manager.plugPersonalWallet(ledgerWallet);
      dispatch(walletConnectedAction);
    },
    [APP_DISPATCH_SYMBOL, LEDGER_WALLET_CONNECTOR_SYMBOL, WEB3_MANAGER_SYMBOL],
  );

export const verifyIfLedgerStillConnected = injectableFn(
  async (dispatch: AppDispatch, ledgerConnector: LedgerWalletConnector) => {
    if (!await ledgerConnector.testConnection()) {
      dispatch(
        ledgerConnectionEstablishedErrorAction({
          errorMsg: mapLedgerErrorToErrorMessage(new LedgerNotAvailableError()),
        }),
      );
    }
  },
  [APP_DISPATCH_SYMBOL, LEDGER_WALLET_CONNECTOR_SYMBOL],
);
