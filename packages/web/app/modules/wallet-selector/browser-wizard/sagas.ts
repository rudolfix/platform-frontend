import { fork, put, select } from "@neufund/sagas";

import { BrowserWalletErrorMessage } from "../../../components/translatedMessages/messages";
import { TGlobalDependencies } from "../../../di/setupBindings";
import {
  BrowserWallet,
  BrowserWalletAccountApprovalRejectedError,
} from "../../../lib/web3/browser-wallet/BrowserWallet";
import { TAppGlobalState } from "../../../store";
import { actions } from "../../actions";
import { neuTakeUntil } from "../../sagasUtils";
import { mapBrowserWalletErrorToErrorMessage } from "./errors";

export function* tryConnectingWithBrowserWallet({
  browserWalletConnector,
  web3Manager,
  logger,
}: TGlobalDependencies): any {
  const state: TAppGlobalState = yield select();
  // todo sort this logic out
  if (!state.browserWalletWizardState.approvalRejected) {
    try {
      const browserWallet: BrowserWallet = yield browserWalletConnector.connect(
        web3Manager.networkId,
      );
      yield web3Manager.plugPersonalWallet(browserWallet);
      yield put(actions.walletSelector.connected());
    } catch (e) {
      if (e instanceof BrowserWalletAccountApprovalRejectedError) {
        // account approval rejected is just a normal error as any other.
        // but leaving it here for now for backwards compatibility
        // TODO find who's using it and fix it so that this is not needed anymore
        yield put(actions.walletSelector.browserWalletAccountApprovalRejectedError());
      }
      const error = mapBrowserWalletErrorToErrorMessage(e);
      yield put(actions.walletSelector.browserWalletConnectionError(error));
      if (error.messageType === BrowserWalletErrorMessage.GENERIC_ERROR) {
        logger.error("Error while trying to connect with browser wallet", e);
      }
    }
  }
}

export function* browserWalletSagas(): Generator<any, any, any> {
  yield fork(
    neuTakeUntil,
    actions.walletSelector.tryConnectingWithBrowserWallet,
    actions.walletSelector.reset,
    tryConnectingWithBrowserWallet,
  );
}
