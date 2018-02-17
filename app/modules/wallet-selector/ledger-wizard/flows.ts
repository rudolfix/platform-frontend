import { toPairs, zip } from "lodash";

import { pairZip } from "../../../../typings/modifications";
import { APP_DISPATCH_SYMBOL, GET_STATE_SYMBOL, GetState } from "../../../getContainer";
import { injectableFn } from "../../../redux-injectify";
import { AppDispatch } from "../../../store";
import { actions } from "../../actions";
import {
  LEDGER_WALLET_CONNECTOR_SYMBOL,
  LedgerLockedError,
  LedgerNotAvailableError,
  LedgerWalletConnector,
} from "../../web3/LedgerWallet";
import { WEB3_MANAGER_SYMBOL, Web3Manager } from "../../web3/Web3Manager";
import { walletFlows } from "../flows";

export const LEDGER_WIZARD_SIMPLE_DERIVATION_PATHS = ["44'/60'/1'/0", "44'/60'/0'/0"]; // TODO this should be taken from config

export const ledgerWizardFlows = {
  tryEstablishingConnectionWithLedger: injectableFn(
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
  ),

  loadLedgerAccounts: injectableFn(
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

      dispatch(actions.wallet.setLedgerAccounts(accounts, derivationPathPrefix));
    },
    [APP_DISPATCH_SYMBOL, GET_STATE_SYMBOL, LEDGER_WALLET_CONNECTOR_SYMBOL, WEB3_MANAGER_SYMBOL],
  ),

  setDerivationPathPrefix: (derivationPathPrefix: string) =>
    injectableFn(
      async (dispatch: AppDispatch, getState: GetState) => {
        const currDp = getState().ledgerWizardState.derivationPathPrefix;

        if (currDp !== derivationPathPrefix) {
          dispatch(actions.wallet.setLedgerWizardDerivationPathPrefix(derivationPathPrefix));
          dispatch(ledgerWizardFlows.loadLedgerAccounts);
        }
      },
      [APP_DISPATCH_SYMBOL, GET_STATE_SYMBOL],
    ),

  goToNextPageAndLoadData: injectableFn(
    (dispatch: AppDispatch) => {
      dispatch(actions.wallet.ledgerWizardAccountsListNextPage());
      return dispatch(ledgerWizardFlows.loadLedgerAccounts);
    },
    [APP_DISPATCH_SYMBOL],
  ),

  goToPreviousPageAndLoadData: injectableFn(
    (dispatch: AppDispatch) => {
      dispatch(actions.wallet.ledgerWizardAccountsListPreviousPage());
      return dispatch(ledgerWizardFlows.loadLedgerAccounts);
    },
    [APP_DISPATCH_SYMBOL],
  ),

  finishSettingUpLedgerConnector: (derivationPath: string) =>
    injectableFn(
      async (
        dispatch: AppDispatch,
        ledgerConnector: LedgerWalletConnector,
        web3Manager: Web3Manager,
      ) => {
        const ledgerWallet = await ledgerConnector.finishConnecting(derivationPath);
        await web3Manager.plugPersonalWallet(ledgerWallet);
        dispatch(walletFlows.walletConnected);
      },
      [APP_DISPATCH_SYMBOL, LEDGER_WALLET_CONNECTOR_SYMBOL, WEB3_MANAGER_SYMBOL],
    ),

  verifyIfLedgerStillConnected: injectableFn(
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
  ),
};

function mapLedgerErrorToErrorMessage(error: Error): string {
  if (error instanceof LedgerLockedError) {
    return "Nano Ledger S is locked";
  }
  return "Nano Ledger S not available";
}
