import { fork, neuCall, neuTakeLatestUntil, put, select } from "@neufund/sagas";

import { BrowserWalletErrorMessage } from "../../../components/translatedMessages/messages";
import { userMayChooseWallet } from "../../../components/wallet-selector/WalletSelectorLogin/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import {
  BrowserWallet,
  BrowserWalletAccountApprovalRejectedError,
} from "../../../lib/web3/browser-wallet/BrowserWallet";
import { TAppGlobalState } from "../../../store";
import { actions, TActionFromCreator } from "../../actions";
import { signInUser } from "../../auth/user/sagas";
import { neuTakeUntil } from "../../sagasUtils";
import { EWalletType } from "../../web3/types";
import { registerForm } from "../forms/sagas";
import { resetWalletSelectorState, walletSelectorConnect } from "../sagas";
import { selectRegisterWalletDefaultFormValues } from "../selectors";
import {
  EBrowserWalletRegistrationFlowState,
  ECommonWalletRegistrationFlowState,
  EFlowType,
  TBrowserWalletFormValues,
} from "../types";
import { selectUrlUserType } from "./../selectors";
import { mapBrowserWalletErrorToErrorMessage } from "./errors";

/**
 * @deprecated
 * @generator Legacy generator that is still used with the login flow for the browser wallet
 * All browser wallet operations should be moved to `browserWalletConnectAndSign` once the
 * reducer is unified.
 *
 * @note browserWalletLogin is the only flow that uses this generator
 *
 */
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
      yield walletSelectorConnect();
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

/**
 * @generator connects a browser wallet and signs in the user once the browser wallet is connected
 *
 * @note `browserWalletConnectAndSign` assumes that the flow data is available already
 * in the state if the values are not in state the generator will throw
 *
 */
export function* browserWalletConnectAndSign({
  browserWalletConnector,
  web3Manager,
  logger,
}: TGlobalDependencies): Generator<any, void, any> {
  const initialFormValues = yield* select(selectRegisterWalletDefaultFormValues);
  if (!initialFormValues) throw new Error();
  try {
    const userType = yield* select(selectUrlUserType);

    yield put(
      actions.walletSelector.setWalletRegisterData({
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING,
      }),
    );
    const browserWallet: BrowserWallet = yield browserWalletConnector.connect(
      web3Manager.networkId,
    );

    yield web3Manager.plugPersonalWallet(browserWallet);
    yield neuCall(signInUser, userType, initialFormValues.email, initialFormValues.tos);
  } catch (e) {
    const errorMessage = mapBrowserWalletErrorToErrorMessage(e);
    if (errorMessage.messageType === BrowserWalletErrorMessage.GENERIC_ERROR) {
      logger.error("Error while trying to connect with browser wallet", e);
    }
    yield put(
      actions.walletSelector.setWalletRegisterData({
        uiState: EBrowserWalletRegistrationFlowState.BROWSER_WALLET_ERROR,
        errorMessage,
      }),
    );
  }
}

// TODO: Clean `browserWalletRegister` and connect the login flow with `tryConnectingWithBrowserWallet`
export function* browserWalletRegister(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.walletSelector.registerWithBrowserWallet>,
): Generator<any, void, any> {
  const userType = payload.userType;

  const baseUiData = {
    walletType: EWalletType.BROWSER,
    showWalletSelector: userMayChooseWallet(userType),
    rootPath: "/register",
    flowType: EFlowType.REGISTER,
  };
  const initialFormValues: TBrowserWalletFormValues = {
    email: "",
    tos: false,
  };
  yield neuCall(resetWalletSelectorState);
  yield neuCall(registerForm, {
    afterRegistrationGenerator: function*(): Generator<any, boolean, any> {
      yield neuCall(browserWalletConnectAndSign);
      return true;
    },
    expectedAction: actions.walletSelector.browserWalletRegisterFormData,
    initialFormValues,
    baseUiData,
  });
}

export function* browserWalletSagas(): Generator<any, any, any> {
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.registerWithBrowserWallet,
    "@@router/LOCATION_CHANGE",
    browserWalletRegister,
  );

  yield fork(
    neuTakeUntil,
    actions.walletSelector.browserWalletSignMessage,
    actions.walletSelector.reset,
    browserWalletConnectAndSign,
  );

  yield fork(
    neuTakeUntil,
    actions.walletSelector.tryConnectingWithBrowserWallet,
    actions.walletSelector.reset,
    tryConnectingWithBrowserWallet,
  );
}
