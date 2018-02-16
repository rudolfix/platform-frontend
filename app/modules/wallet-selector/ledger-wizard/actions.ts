import { toPairs, zip } from "lodash";

import { pairZip } from "../../../../typings/modifications";
import { APP_DISPATCH_SYMBOL, GET_STATE_SYMBOL, GetState } from "../../../getContainer";
import { injectableFn } from "../../../redux-injectify";
import { AppDispatch, IAppAction } from "../../../store";
import { makeActionCreator } from "../../../storeHelpers";
import { actions, createAction, createSimpleAction } from "../../actions";
import { flows } from "../../flows";
import {
  LEDGER_WALLET_CONNECTOR_SYMBOL,
  LedgerLockedError,
  LedgerNotAvailableError,
  LedgerWalletConnector,
} from "../../web3/LedgerWallet";
import { WEB3_MANAGER_SYMBOL, Web3Manager } from "../../web3/Web3Manager";
import { ILedgerAccount } from "./reducer";

export const LEDGER_WIZARD_SIMPLE_DERIVATION_PATHS = ["44'/60'/1'/0", "44'/60'/0'/0"]; // TODO this should be taken from config

export const ledgerWizzardActions = {
  ledgerWizardAccountsListNextPage: () =>
    createSimpleAction("LEDGER_WIZARD_ACCOUNTS_LIST_NEXT_PAGE"),

  ledgerWizardAccountsListPreviousPage: () =>
    createSimpleAction("LEDGER_WIZARD_ACCOUNTS_LIST_PREVIOUS_PAGE"),

  ledgerConnectionEstablished: () => createSimpleAction("LEDGER_CONNECTION_ESTABLISHED"),

  ledgerConnectionEstablishedError: (errorMsg: string) =>
    createAction("LEDGER_CONNECTION_ESTABLISHED_ERROR", { errorMsg }),

  setLedgerWizardDerivationPathPrefix: (derivationPathPrefix: string) =>
    createAction("SET_LEDGER_WIZARD_DERIVATION_PATH_PREFIX", { derivationPathPrefix }),

  ledgerWizardDerivationPathPrefixError: () =>
    createSimpleAction("LEDGER_WIZARD_DERIVATION_PATH_PREFIX_ERROR"),

  toggleLedgerAccountsAdvanced: () => createSimpleAction("TOGGLE_LEDGER_WIZARD_ADVANCED"),
};

export interface ISetLedgerWizardAccountsAction extends IAppAction {
  type: "SET_LEDGER_WIZARD_ACCOUNTS";
  payload: {
    accounts: ILedgerAccount[];
    derivationPathPrefix: string; // TODO: this should be optional as for case of predefined accounts we are not using it
  };
}

export const setLedgerAccountsAction = makeActionCreator<ISetLedgerWizardAccountsAction>(
  "SET_LEDGER_WIZARD_ACCOUNTS",
);

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

      dispatch(actions.wallet.ledgerConnectionEstablished());
    } catch (e) {
      dispatch(actions.wallet.ledgerConnectionEstablishedError(mapLedgerErrorToErrorMessage(e)));
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
        dispatch(actions.wallet.setLedgerWizardDerivationPathPrefix(derivationPathPrefix));
        dispatch(loadLedgerAccountsAction);
      }
    },
    [APP_DISPATCH_SYMBOL, GET_STATE_SYMBOL],
  );

export const goToNextPageAndLoadDataAction = injectableFn(
  (dispatch: AppDispatch) => {
    dispatch(actions.wallet.ledgerWizardAccountsListNextPage());
    return dispatch(loadLedgerAccountsAction);
  },
  [APP_DISPATCH_SYMBOL],
);

export const goToPreviousPageAndLoadDataAction = injectableFn(
  (dispatch: AppDispatch) => {
    dispatch(actions.wallet.ledgerWizardAccountsListPreviousPage());
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
      dispatch(flows.wallet.walletConnected);
    },
    [APP_DISPATCH_SYMBOL, LEDGER_WALLET_CONNECTOR_SYMBOL, WEB3_MANAGER_SYMBOL],
  );

export const verifyIfLedgerStillConnected = injectableFn(
  async (dispatch: AppDispatch, ledgerConnector: LedgerWalletConnector) => {
    if (!await ledgerConnector.testConnection()) {
      dispatch(
        actions.wallet.ledgerConnectionEstablishedError(
          mapLedgerErrorToErrorMessage(new LedgerNotAvailableError()),
        ),
      );
    }
  },
  [APP_DISPATCH_SYMBOL, LEDGER_WALLET_CONNECTOR_SYMBOL],
);
