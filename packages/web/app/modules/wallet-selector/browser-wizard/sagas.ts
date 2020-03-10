import { fork, neuCall, neuTakeLatestUntil, put, select, take } from "@neufund/sagas";

import { BrowserWalletErrorMessage } from "../../../components/translatedMessages/messages";
import { userMayChooseWallet } from "../../../components/wallet-selector/WalletSelectorLogin/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import {
  BrowserWallet,
  BrowserWalletAccountApprovalRejectedError,
} from "../../../lib/web3/browser-wallet/BrowserWallet";
import { TAppGlobalState } from "../../../store";
import { actions, TActionFromCreator } from "../../actions";
import { handleSignInUser } from "../../auth/user/sagas";
import { neuTakeUntil } from "../../sagasUtils";
import { EWalletType } from "../../web3/types";
import { registerForm } from "../forms/sagas";
import {
  resetWalletSelectorState,
  TBaseUiData,
  walletSelectorConnect,
  walletSelectorReset,
} from "../sagas";
import { selectRegisterWalletDefaultFormValues } from "../selectors";
import {
  EBrowserWalletRegistrationFlowState,
  ECommonWalletRegistrationFlowState,
  EFlowType,
  TBrowserWalletFormValues,
} from "../types";
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

export function* browserWalletConnectAndSign(
  { browserWalletConnector, web3Manager, logger }: TGlobalDependencies,
  baseUiData: TBaseUiData,
): Generator<any, boolean, any> {
  try {
    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING,
        initialFormValues: (yield* select(
          selectRegisterWalletDefaultFormValues,
        )) as TBrowserWalletFormValues,
      } as const),
    );
    const browserWallet: BrowserWallet = yield browserWalletConnector.connect(
      web3Manager.networkId,
    );
    yield web3Manager.plugPersonalWallet(browserWallet);
    return true;
  } catch (e) {
    const errorMessage = mapBrowserWalletErrorToErrorMessage(e);
    if (errorMessage.messageType === BrowserWalletErrorMessage.GENERIC_ERROR) {
      logger.error("Error while trying to connect with browser wallet", e);
    }
    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        uiState: EBrowserWalletRegistrationFlowState.BROWSER_WALLET_ERROR,
        errorMessage,
        initialFormValues: (yield* select(
          selectRegisterWalletDefaultFormValues,
        )) as TBrowserWalletFormValues,
      } as const),
    );
    return false;
  }
}
export function* browserWalletRegister(
  { logger }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.walletSelector.registerWithBrowserWallet>,
): Generator<any, void, any> {
  yield neuCall(resetWalletSelectorState);
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
  try {
    const { email } = yield neuCall(
      registerForm,
      actions.walletSelector.browserWalletRegisterFormData,
      initialFormValues,
      baseUiData,
    );
    while (true) {
      const connectionEstablished = yield neuCall(browserWalletConnectAndSign, baseUiData);
      if (connectionEstablished) {
        break;
      } else {
        yield take(actions.walletSelector.browserWalletSignMessage);
      }
    }
    yield neuCall(handleSignInUser, userType, email, true);
  } catch (e) {
    logger.error(new Error("An error while registering with a browser wallet", e));
    yield walletSelectorReset();
  }
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
    actions.walletSelector.tryConnectingWithBrowserWallet,
    actions.walletSelector.reset,
    tryConnectingWithBrowserWallet,
  );
}
