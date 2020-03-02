import {
  fork,
  take,
  put,
  cancelled,
  neuCall,
  select,
  neuTakeEvery,
  neuTakeLatestUntil,
  neuTakeLatest
} from "@neufund/sagas";

import { actions, TActionFromCreator } from "../actions";
import { handleSignInUser, signInUser } from "../auth/user/sagas";
import { loadPreviousWallet } from "../web3/sagas";
import { EBrowserWalletState } from "./reducer";
import { BrowserWallet } from "../../lib/web3/browser-wallet/BrowserWallet";
import { TGlobalDependencies } from "../../di/setupBindings";
import { mapBrowserWalletErrorToErrorMessage } from "./browser-wizard/errors";
import {
  BrowserWalletErrorMessage,
  GenericErrorMessage,
} from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { selectRegisterWithBrowserWalletDefaultFormValues } from "./selectors";
import { checkEmailPromise } from "../auth/email/sagas";

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

export function* registerGetEmailAndTos(
  { logger }: TGlobalDependencies
): Generator<any, void, any> {
  const defaultFormValues = yield* select(selectRegisterWithBrowserWalletDefaultFormValues);

  const baseUiData = { //fixme select this from state
    showWalletSelector: true,
    rootPath: "/register",
  };

  const askForEmailData = {
    ...baseUiData,
    browserWalletState: EBrowserWalletState.BROWSER_WALLET_ASK_FOR_EMAIL,
    defaultFormValues
  } as const;
  yield put(actions.walletSelector.setWalletRegisterData(askForEmailData));

  while (true) {
    const { payload } = yield take(actions.walletSelector.browserWalletRegisterEmailAndTos);

    const emailVerifyingData = {
      ...baseUiData,
      browserWalletState: EBrowserWalletState.BROWSER_WALLET_VERIFYING_EMAIL,
      defaultFormValues: {
        ...defaultFormValues,
        email: payload.email
      }
    } as const;
    yield put(actions.walletSelector.setWalletRegisterData(emailVerifyingData));

    let isEmailAvailable = false;

    try {
      isEmailAvailable = yield neuCall(checkEmailPromise, payload.email);
    } catch (e) {
      console.log("error", e)
      const errorMessage = mapBrowserWalletErrorToErrorMessage(e);
      if (errorMessage.messageType === BrowserWalletErrorMessage.GENERIC_ERROR) {
        logger.error("Could not check for email availability", e);
      }
      return;
    }

    if (!isEmailAvailable) {
      const error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);

      const emailErrorData = {
        ...baseUiData,
        browserWalletState: EBrowserWalletState.BROWSER_WALLET_EMAIL_VERIFICATION_ERROR,
        errorMessage: error,
        defaultFormValues
      } as const;
      yield put(actions.walletSelector.setWalletRegisterData(emailErrorData));

    } else {
      break;
    }
  }
}

export function* browserWalletSignByAction(
  _: TActionFromCreator<typeof actions.walletSelector.browserWalletSignMessage>
) {
  return yield neuCall(browserWalletSign)
}

export function* browserWalletSign({
  browserWalletConnector,
  web3Manager,
  logger,
}: TGlobalDependencies): Generator<any, void, any> {
  const baseData = { //fixme!!
    showWalletSelector: true,
    rootPath: "/register",
  };

  try {
    const data = {
      ...baseData,
      browserWalletState: EBrowserWalletState.BROWSER_WALLET_LOADING,
      defaultFormValues: yield* select(selectRegisterWithBrowserWalletDefaultFormValues)
    } as const;
    yield put(actions.walletSelector.setWalletRegisterData(data));

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
      ...baseData,
      browserWalletState: EBrowserWalletState.BROWSER_WALLET_ERROR,
      errorMessage,
      defaultFormValues: yield* select(selectRegisterWithBrowserWalletDefaultFormValues)
    } as const;
    yield put(actions.walletSelector.setWalletRegisterData(errorData));

    return;
  }
}

export function* browserWalletRegister(
  _: TGlobalDependencies) {
  yield console.log("browserWalletRegister start");
  try {
    yield neuCall(registerGetEmailAndTos);
    yield neuCall(browserWalletSign);
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
  yield fork(neuTakeLatestUntil, actions.walletSelector.registerWithBrowserWallet, "@@router/LOCATION_CHANGE", browserWalletRegister);
  yield fork(neuTakeLatest, actions.walletSelector.browserWalletSignMessage, browserWalletSignByAction);
}
