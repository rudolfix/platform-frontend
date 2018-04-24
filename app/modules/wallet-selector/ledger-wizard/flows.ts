import { toPairs, zip } from "lodash";
import { WalletStorage } from "./../../../lib/persistence/WalletStorage";

import { pairZip } from "../../../../typings/modifications";
import { GetState } from "../../../di/setupBindings";
import { symbols } from "../../../di/symbols";
import { TWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import { LedgerNotAvailableError, LedgerWalletConnector } from "../../../lib/web3/LedgerWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { AppDispatch } from "../../../store";
import { actions } from "../../actions";
import { selectUrlUserType } from "../selectors";
import { mapLedgerErrorToErrorMessage } from "./errors";

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

        dispatch(actions.walletSelector.ledgerConnectionEstablished());
      } catch (e) {
        dispatch(
          actions.walletSelector.ledgerConnectionEstablishedError(mapLedgerErrorToErrorMessage(e)),
        );
      }
    },
    [symbols.appDispatch, symbols.ledgerWalletConnector, symbols.web3Manager],
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

      dispatch(actions.walletSelector.setLedgerAccounts(accounts, derivationPathPrefix));
    },
    [symbols.appDispatch, symbols.getState, symbols.ledgerWalletConnector, symbols.web3Manager],
  ),

  setDerivationPathPrefix: (derivationPathPrefix: string) =>
    injectableFn(
      async (dispatch: AppDispatch, getState: GetState) => {
        const currDp = getState().ledgerWizardState.derivationPathPrefix;

        if (currDp !== derivationPathPrefix) {
          dispatch(
            actions.walletSelector.setLedgerWizardDerivationPathPrefix(derivationPathPrefix),
          );
          dispatch(ledgerWizardFlows.loadLedgerAccounts);
        }
      },
      [symbols.appDispatch, symbols.getState],
    ),

  goToNextPageAndLoadData: injectableFn(
    (dispatch: AppDispatch) => {
      dispatch(actions.walletSelector.ledgerWizardAccountsListNextPage());
      return dispatch(ledgerWizardFlows.loadLedgerAccounts);
    },
    [symbols.appDispatch],
  ),

  goToPreviousPageAndLoadData: injectableFn(
    (dispatch: AppDispatch) => {
      dispatch(actions.walletSelector.ledgerWizardAccountsListPreviousPage());
      return dispatch(ledgerWizardFlows.loadLedgerAccounts);
    },
    [symbols.appDispatch],
  ),

  finishSettingUpLedgerConnector: (derivationPath: string) =>
    injectableFn(
      async (
        dispatch: AppDispatch,
        ledgerConnector: LedgerWalletConnector,
        web3Manager: Web3Manager,
        walletStorage: WalletStorage<TWalletMetadata>,
        getState: GetState,
      ) => {
        const userType = selectUrlUserType(getState().router);

        const ledgerWallet = await ledgerConnector.finishConnecting(derivationPath);
        await web3Manager.plugPersonalWallet(ledgerWallet);

        // todo move saving metadata to unified connect functions
        walletStorage.set(ledgerWallet.getMetadata(), "investor"); //HERE
        dispatch(actions.walletSelector.connected(userType));
      },
      [
        symbols.appDispatch,
        symbols.ledgerWalletConnector,
        symbols.web3Manager,
        symbols.walletStorage, //HERE
        symbols.getState,
      ],
    ),

  verifyIfLedgerStillConnected: injectableFn(
    async (dispatch: AppDispatch, ledgerConnector: LedgerWalletConnector) => {
      if (!await ledgerConnector.testConnection()) {
        dispatch(
          actions.walletSelector.ledgerConnectionEstablishedError(
            mapLedgerErrorToErrorMessage(new LedgerNotAvailableError()),
          ),
        );
      }
    },
    [symbols.appDispatch, symbols.ledgerWalletConnector],
  ),
};
