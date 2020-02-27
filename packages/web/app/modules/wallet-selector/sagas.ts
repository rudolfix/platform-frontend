import { fork, neuTakeLatest, put, cancelled } from "@neufund/sagas";

import { actions } from "../actions";
import { handleSignInUser, signInUser } from "../auth/user/sagas";
import { neuCall, neuTakeEvery, neuTakeLatestUntil } from "../sagasUtils";
import { loadPreviousWallet } from "../web3/sagas";
import { EWalletType } from "../web3/types";
import { EBrowserWalletState } from "./reducer";
import { tryConnectingWithBrowserWallet } from "./browser-wizard/sagas";
import { BrowserWallet, BrowserWalletAccountApprovalRejectedError } from "../../lib/web3/browser-wallet/BrowserWallet";
import { TGlobalDependencies } from "../../di/setupBindings";
import { mapBrowserWalletErrorToErrorMessage } from "./browser-wizard/errors";
import { BrowserWalletErrorMessage } from "../../components/translatedMessages/messages";

export function* walletSelectorConnect(): Generator<any, any, any> {
  yield put(actions.walletSelector.messageSigning());

  yield neuCall(handleSignInUser);
}

export function* walletSelectorReset(): Generator<any, any, any> {
  yield neuCall(loadPreviousWallet);
}

export function* walletSelectorRegisterRedirect(): Generator<any, void, any> {
  yield put(actions.routing.goToLightWalletRegister());
}

export function* browserWalletRegister({
  browserWalletConnector,
  web3Manager,
  logger,
}: TGlobalDependencies) {
    yield console.log("browserWalletRegister start");
  try {
    const data = {
      showWalletSelector: true,
      rootPath: "/register",
      browserWalletState: EBrowserWalletState.BROWSER_WALLET_LOADING,
      walletSelectionDisabled:false
    } as const;
    yield put(actions.walletSelector.setWalletRegisterData(data))

    const browserWallet: BrowserWallet = yield browserWalletConnector.connect(
      web3Manager.networkId,
    );
    yield web3Manager.plugPersonalWallet(browserWallet);

    yield neuCall(signInUser);
  } catch (e) {
    console.log("error", e)
    const errorMessage = mapBrowserWalletErrorToErrorMessage(e);
    if (errorMessage.messageType === BrowserWalletErrorMessage.GENERIC_ERROR) {
      logger.error("Error while trying to connect with browser wallet", e);
    }

    const errorData = {
      showWalletSelector: true,
      rootPath: "/register",
      browserWalletState: EBrowserWalletState.BROWSER_WALLET_ERROR,
      errorMessage
    } as const;
    yield put(actions.walletSelector.setWalletRegisterData(errorData))


  } finally {
    if (yield cancelled()) {
      yield walletSelectorReset();
      yield console.log("browserWalletRegister finally cancelled")
    } else {
      yield console.log("browserWalletRegister finally")
    }
  }
}

export function* walletSelectorSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.walletSelector.reset, walletSelectorReset);
  yield fork(neuTakeEvery, actions.walletSelector.registerRedirect, walletSelectorRegisterRedirect);
  yield fork(neuTakeLatest, actions.walletSelector.registerWithBrowserWallet, browserWalletRegister);
}
