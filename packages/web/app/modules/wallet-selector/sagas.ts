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
import {
  EBrowserWalletState,
  ECommonWalletState,
  ELightWalletState,
  TBrowserWalletFormValues,
  TLightWalletFormValues
} from "./types";
import { BrowserWallet } from "../../lib/web3/browser-wallet/BrowserWallet";
import { TGlobalDependencies } from "../../di/setupBindings";
import { mapBrowserWalletErrorToErrorMessage } from "./browser-wizard/errors";
import {
  AuthMessage,
  BrowserWalletErrorMessage,
  GenericErrorMessage,
} from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { selectRegisterWalletDefaultFormValues } from "./selectors";
import { checkEmailPromise } from "../auth/email/sagas";
import { EWalletType } from "../web3/types";
import { handleLightWalletError, setupLightWalletPromise } from "./light-wizard/sagas";

type TBaseUiData = {
  walletType: EWalletType,
  showWalletSelector: boolean,
  rootPath: string,
}

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

export function* browserLedgerRegisterForm(
  _: TGlobalDependencies
): Generator<any, { email: string, } | undefined, any> {
  const initialFormValues: TBrowserWalletFormValues = {
    email: "",
    tos: false
  };

  const baseUiData = {
    walletType: EWalletType.BROWSER,
    showWalletSelector: true,
    rootPath: "/register",
  };

  yield put(actions.walletSelector.setWalletRegisterData({
    ...baseUiData,
    walletState: ECommonWalletState.REGISTRATION_FORM,
    initialFormValues
  } as const));

  return yield neuCall(getEmailVerification,
    actions.walletSelector.browserWalletRegisterFormData,
    initialFormValues,
    baseUiData
  )
}

export function* browserWalletConnectAndSignByAction( //fixme naming
  _: TActionFromCreator<typeof actions.walletSelector.browserWalletSignMessage>
) {
  return yield neuCall(browserWalletConnectAndSign)
}

export function* browserWalletConnectAndSign({
  browserWalletConnector,
  web3Manager,
  logger,
}: TGlobalDependencies): Generator<any, void, any> {
  const baseUiData = { //fixme!!
    showWalletSelector: true,
    rootPath: "/register",
  };

  try {
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: EBrowserWalletState.BROWSER_WALLET_LOADING,
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues
    } as const));

    const browserWallet: BrowserWallet = yield browserWalletConnector.connect(
      web3Manager.networkId,
    );
    yield web3Manager.plugPersonalWallet(browserWallet);

    yield neuCall(signInUser);
  } catch (e) {
    const errorMessage = mapBrowserWalletErrorToErrorMessage(e);
    if (errorMessage.messageType === BrowserWalletErrorMessage.GENERIC_ERROR) {
      logger.error("Error while trying to connect with browser wallet", e);
    }

    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: EBrowserWalletState.BROWSER_WALLET_ERROR,
      errorMessage,
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues
    } as const));

    return;
  }
}

export function* lightWalletConnectAndSign(
  _: TGlobalDependencies,
  email: string,
  password: string
): Generator<any, void, any> {
  const baseUiData = { //fixme!!
    showWalletSelector: true,
    rootPath: "/register",
  };

  try {
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: ELightWalletState.LIGHT_WALLET_SIGNING,
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TLightWalletFormValues
    } as const));

    yield neuCall(setupLightWalletPromise, email, password);
    yield neuCall(handleSignInUser);
  } catch (e) {
    yield neuCall(handleLightWalletError, e);
  }
}

export function* getEmailVerification(
  { notificationCenter }: TGlobalDependencies,
  expectedAction: (typeof actions.walletSelector.lightWalletRegisterFormData | typeof actions.walletSelector.browserWalletRegisterFormData),
  initialFormValues: TBrowserWalletFormValues | TLightWalletFormValues,
  baseUiData: TBaseUiData,
): Generator<any, { email: string, password: string } | undefined, any> {
  while (true) {
    const { payload } = yield take(expectedAction);

    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: ECommonWalletState.REGISTRATION_VERIFYING_EMAIL,
      initialFormValues: {
        ...initialFormValues,
        email: payload.email
      }
    } as const));

    let isEmailAvailable = false;
    try {
      isEmailAvailable = yield neuCall(checkEmailPromise, payload.email);
    } catch (e) {
      yield put(actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        walletState: ECommonWalletState.REGISTRATION_FORM,
        initialFormValues: {
          ...initialFormValues,
          email: payload.email
        }
      } as const));

      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED));
      return;
    }

    if (!isEmailAvailable) {
      const error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);
      yield put(actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        walletState: ECommonWalletState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
        errorMessage: error,
        initialFormValues: {
          ...initialFormValues,
          email: payload.email
        }
      } as const));

    } else {
      return payload;
    }
  }
}

export function* lightWalletRegisterForm(
  _: TGlobalDependencies,
): Generator<any, { email: string, password: string } | undefined, any> {
  const initialFormValues: TLightWalletFormValues = {
    email: "",
    password: "",
    repeatPassword: "",
    tos: false
  };

  const baseUiData = { //fixme select this from state
    walletType: EWalletType.LIGHT,
    showWalletSelector: true,
    rootPath: "/register",
  };
  yield put(actions.walletSelector.setWalletRegisterData({
    ...baseUiData,
    initialFormValues,
    walletState: ECommonWalletState.REGISTRATION_FORM,
  } as const));

  return yield neuCall(getEmailVerification,
    actions.walletSelector.lightWalletRegisterFormData,
    initialFormValues,
    baseUiData
  )
}

export function* saveUsersEmail(
  _: TGlobalDependencies,
  email: string
): Generator<any, void, any> {
  //fixme save email to api
  try {
    console.log('email', email)
  } catch (e) {

  }
}

export function* lightWalletRegister(
  _: TGlobalDependencies): Generator<any, void, any> {
  yield console.log("lightWalletRegister start");
  try {
    const { email, password } = yield neuCall(lightWalletRegisterForm);
    yield neuCall(lightWalletConnectAndSign, email, password)
  } finally {
    yield walletSelectorReset();
    if (yield cancelled()) {
      yield console.log("lightWalletRegister finally cancelled")
    } else {
      yield console.log("lightWalletRegister finally")
    }
  }
}

export function* browserWalletRegister(
  _: TGlobalDependencies): Generator<any, void, any> {
  yield console.log("browserWalletRegister start");
  try {
    const { email } = yield neuCall(browserLedgerRegisterForm);
    yield neuCall(saveUsersEmail, email);
    yield neuCall(browserWalletConnectAndSign);
  } finally {
    yield walletSelectorReset();

    if (yield cancelled()) {
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
  yield fork(neuTakeLatestUntil, actions.walletSelector.registerWithLightWallet, "@@router/LOCATION_CHANGE", lightWalletRegister);
  yield fork(neuTakeLatest, actions.walletSelector.browserWalletSignMessage, browserWalletConnectAndSignByAction);
}
