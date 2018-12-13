import { put, select } from "redux-saga/effects";

import { BrowserWalletErrorMessage } from "../../../components/translatedMessages/messages";
import { TGlobalDependencies } from "../../../di/setupBindings";
import {
  BrowserWallet,
  BrowserWalletAccountApprovalRejectedError,
} from "../../../lib/web3/BrowserWallet";
import { IAppState } from "../../../store";
import { actions } from "../../actions";
import { mapBrowserWalletErrorToErrorMessage } from "./errors";

export function* tryConnectingWithBrowserWallet({
  browserWalletConnector,
  web3Manager,
  logger,
}: TGlobalDependencies): any {
  const state: IAppState = yield select();
  if (!state.browserWalletWizardState.approvalRejected) {
    try {
      const browserWallet: BrowserWallet = yield browserWalletConnector.connect(
        web3Manager.networkId,
      );

      yield web3Manager.plugPersonalWallet(browserWallet);
      yield put(actions.walletSelector.connected());
      yield console.log();
    } catch (e) {
      if (e instanceof BrowserWalletAccountApprovalRejectedError) {
        yield put(actions.walletSelector.browserWalletAccountApprovalRejectedError());
      } else {
        const error = mapBrowserWalletErrorToErrorMessage(e);
        yield put(actions.walletSelector.browserWalletConnectionError(error));
        if (error.messageType === BrowserWalletErrorMessage.GENERIC_ERROR) {
          logger.error("Error while trying to connect with browser wallet", e);
        }
      }
    }
  }
}
