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
  EBrowserWalletRegistrationFlowState,
  ECommonWalletRegistrationFlowState, ELedgerRegistrationFlowState,
  ELightWalletRegistrationFlowState,
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
import { isSupportingLedger } from "../user-agent/reducer";
import { mapLedgerErrorToErrorMessage } from "./ledger-wizard/errors";

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

export function* browserWalletConnectAndSignByAction( //fixme naming
  _: TActionFromCreator<typeof actions.walletSelector.browserWalletSignMessage>
) {
  const baseUiData = {
    walletType: EWalletType.BROWSER,
    showWalletSelector: true,
    rootPath: "/register",
  };

  return yield neuCall(browserWalletConnectAndSign,baseUiData)
}

export function* browserWalletConnectAndSign({
    browserWalletConnector,
    web3Manager,
    logger,
  }: TGlobalDependencies,
  baseUiData: TBaseUiData
): Generator<any, void, any> {

  try {
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING,
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
      walletState: EBrowserWalletRegistrationFlowState.BROWSER_WALLET_ERROR,
      errorMessage,
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues
    } as const));

    return;
  }
}

export function* ledgerConnectAndSign({
    ledgerWalletConnector,
    web3Manager,
    logger,
  }: TGlobalDependencies,
  baseUiData: TBaseUiData
) {
  console.log("ledgerConnectAndSign")
  try {
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: ELedgerRegistrationFlowState.LEDGER_INIT,
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues
    } as const));


    yield ledgerWalletConnector.connect();
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: ELedgerRegistrationFlowState.LEDGER_ACCOUNT_CHOOSER,
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues
    } as const));
  } catch(e){
    console.log(e)
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
      errorMessage: mapLedgerErrorToErrorMessage(e),
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues
    } as const));
  }
}

export function* lightWalletConnectAndSign(
  _: TGlobalDependencies,
  baseUiData: TBaseUiData,
  email: string,
  password: string
): Generator<any, void, any> {

  try {
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING,
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
      walletState: ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
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
        walletState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
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
        walletState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
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

export function* browserLedgerRegisterForm(
  _: TGlobalDependencies,
  baseUiData: TBaseUiData
): Generator<any, { email: string, } | undefined, any> {
  const initialFormValues: TBrowserWalletFormValues = {
    email: "",
    tos: false
  };

  yield put(actions.walletSelector.setWalletRegisterData({
    ...baseUiData,
    walletState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    initialFormValues
  } as const));

  return yield neuCall(getEmailVerification,
    actions.walletSelector.browserWalletRegisterFormData,
    initialFormValues,
    baseUiData
  )
}

export function* lightWalletRegisterForm(
  _: TGlobalDependencies,
  baseUiData: TBaseUiData
): Generator<any, { email: string, password: string } | undefined, any> {
  const initialFormValues: TLightWalletFormValues = {
    email: "",
    password: "",
    repeatPassword: "",
    tos: false
  };


  yield put(actions.walletSelector.setWalletRegisterData({
    ...baseUiData,
    initialFormValues,
    walletState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
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
  console.log("lightWalletRegister start");

  const baseUiData = {
    walletType: EWalletType.LIGHT,
    showWalletSelector: true,
    rootPath: "/register",
  };

  try {
    const { email, password } = yield neuCall(lightWalletRegisterForm, baseUiData);
    yield neuCall(lightWalletConnectAndSign, baseUiData, email, password)
  } finally {
    yield walletSelectorReset();
    //fixme reset state
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

  const baseUiData = {
    walletType: EWalletType.BROWSER,
    showWalletSelector: true,
    rootPath: "/register",
  };

  try {
    const { email } = yield neuCall(browserLedgerRegisterForm, baseUiData);
    yield neuCall(saveUsersEmail, email);
    yield neuCall(browserWalletConnectAndSign, baseUiData);
  } finally {
    yield walletSelectorReset();
    //fixme reset state
    if (yield cancelled()) {
      yield console.log("browserWalletRegister finally cancelled")
    } else {
      yield console.log("browserWalletRegister finally")
    }
  }
}

export function* ensureLedgerIsSupported (
  _:TGlobalDependencies,
  baseUiData: TBaseUiData
):Generator<any,void,any> {
  const ledgerIsSupported = yield* select(isSupportingLedger);
  if(!ledgerIsSupported){
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      initialFormValues: {
        email: "",
        tos: false
      },
      walletState: ELedgerRegistrationFlowState.LEDGER_NOT_SUPPORTED,
    } as const));
    throw new Error() //fixme ?????????
  }
}

export function* ledgerRegister(
  {ledgerWalletConnector}: TGlobalDependencies): Generator<any, void, any> {
  yield console.log("ledgerRegister start");

  const baseUiData = {
    walletType: EWalletType.LEDGER,
    showWalletSelector: true,
    rootPath: "/register",
  };

  try {
    yield neuCall(ensureLedgerIsSupported, baseUiData);
    const { email } = yield neuCall(browserLedgerRegisterForm, baseUiData);





    yield neuCall(saveUsersEmail, email);
    yield neuCall(ledgerConnectAndSign,baseUiData);
  } finally {
    yield walletSelectorReset();
    //fixme reset state
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
  yield fork(neuTakeLatestUntil, actions.walletSelector.registerWithLedger, "@@router/LOCATION_CHANGE", ledgerRegister);
  yield fork(neuTakeLatest, actions.walletSelector.browserWalletSignMessage, browserWalletConnectAndSignByAction);
}
