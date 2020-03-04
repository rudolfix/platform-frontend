import { fork, neuCall, neuTakeEvery, neuTakeLatestUntil, put, race, select, take, } from "@neufund/sagas";

import { actions, TActionFromCreator, } from "../actions";
import { handleSignInUser, signInUser } from "../auth/user/sagas";
import { loadPreviousWallet } from "../web3/sagas";
import {
  EBrowserWalletRegistrationFlowState,
  ECommonWalletRegistrationFlowState,
  ELedgerRegistrationFlowState,
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
import { walletSelectorInitialState } from "./reducer";
import { loadLedgerAccounts } from "./ledger-wizard/sagas";
import { EUserType } from "../../lib/api/users/interfaces";
import { userMayChooseWallet } from "../../components/wallet-selector/utils";

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

export function* walletSelectorRegisterRedirect(
  _: TGlobalDependencies,
  {payload}: TActionFromCreator<typeof actions.walletSelector.registerRedirect>
): Generator<any, void, any> {
  console.log("walletSelectorRegisterRedirect", payload.userType)
  switch (payload.userType) {
    case EUserType.INVESTOR:
      yield put(actions.routing.goToLightWalletRegister());
      break;
    case EUserType.ISSUER:
      yield put(actions.routing.goToIssuerLightWalletRegister());
      break;
    case EUserType.NOMINEE:
      yield put(actions.routing.goToNomineeLightWalletRegister());
      break;
  }
}

export function* browserWalletConnectAndSign({
    browserWalletConnector,
    web3Manager,
    logger,
  }: TGlobalDependencies,
  baseUiData: TBaseUiData
): Generator<any, boolean, any> {

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
    return true;
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

    return false;
  }
}

export function* ledgerConnectAndSign({
    ledgerWalletConnector,
  }: TGlobalDependencies,
  baseUiData: TBaseUiData
): Generator<any, boolean, any> {
  try {
    while (true) {
      let connectionOk: boolean;
      try {
        yield put(actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          walletState: ELedgerRegistrationFlowState.LEDGER_INIT,
          initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues
        } as const));
        yield ledgerWalletConnector.connect();
        connectionOk = true

      } catch (e) {
        console.log(e)
        yield put(actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          walletState: ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
          errorMessage: mapLedgerErrorToErrorMessage(e),
          initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues
        } as const));
        connectionOk = false
      }
      if (connectionOk) {
        break;
      } else {
        yield take(actions.walletSelector.ledgerReconnect);
      }
    }


    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: ELedgerRegistrationFlowState.LEDGER_ACCOUNT_CHOOSER,
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues
    } as const));

    yield neuCall(loadLedgerAccounts);

    const { aborted } = yield race({
      success: take(actions.walletSelector.ledgerFinishSettingUpLedgerConnector),
      aborted: take(actions.walletSelector.ledgerCloseAccountChooser)
    });

    return !aborted

  } catch (e) {
    console.log(e)
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      walletState: ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
      errorMessage: mapLedgerErrorToErrorMessage(e),
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues
    } as const));
    return false
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
  baseUiData: TBaseUiData,
  initialFormValues: TBrowserWalletFormValues
): Generator<any, { email: string, } | undefined, any> {

  yield put(actions.walletSelector.setWalletRegisterData({
    ...baseUiData,
    walletState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    initialFormValues,
    errorMessage: undefined
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

export function* lightWalletRegister(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.walletSelector.registerWithLightWallet>
): Generator<any, void, any> {
  yield neuCall(resetWalletSelectorState);

  const baseUiData = {
    walletType: EWalletType.LIGHT,
    showWalletSelector: userMayChooseWallet(payload.userType),
    rootPath: "/register",
  };

  try {
    const { email, password } = yield neuCall(lightWalletRegisterForm, baseUiData);
    yield neuCall(lightWalletConnectAndSign, baseUiData, email, password);
    yield neuCall(handleSignInUser);
  } finally {
    yield walletSelectorReset();
  }
}

export function* browserWalletRegister(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.walletSelector.registerWithBrowserWallet>
): Generator<any, void, any> {
  yield neuCall(resetWalletSelectorState);

  const userType = payload.userType;
  const baseUiData = {
    walletType: EWalletType.BROWSER,
    showWalletSelector: userMayChooseWallet(userType),
    rootPath: "/register",
  };
  const initialFormValues: TBrowserWalletFormValues = {
    email: "",
    tos: false
  };

  yield neuCall(resetWalletSelectorState);

  try {
    const { email } = yield neuCall(browserLedgerRegisterForm, baseUiData, initialFormValues);
    while (true) {
      const connectionEstablished = yield neuCall(browserWalletConnectAndSign, baseUiData);
      if (connectionEstablished) {
        break;
      } else {
        yield take(actions.walletSelector.browserWalletSignMessage);
      }
    }

    try {
      yield neuCall(signInUser, userType, email, true);
    } catch (e) {
      console.log(e)
    }
  } finally {
    yield walletSelectorReset();
  }
}


export function* ensureLedgerIsSupported(
  _: TGlobalDependencies,
  baseUiData: TBaseUiData
): Generator<any, boolean, any> {
  const ledgerIsSupported = yield* select(isSupportingLedger);
  if (!ledgerIsSupported) {
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      initialFormValues: {
        email: "",
        tos: false
      },
      walletState: ELedgerRegistrationFlowState.LEDGER_NOT_SUPPORTED,
    } as const));
  }
  return ledgerIsSupported
}

export function* ledgerRegister(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.walletSelector.registerWithLedger>
): Generator<any, void, any> {
  yield neuCall(resetWalletSelectorState);

  const userType = payload.userType;
  const baseUiData = {
    walletType: EWalletType.LEDGER,
    showWalletSelector: userMayChooseWallet(userType),
    rootPath: "/register",
  };

  const initialFormValues: TBrowserWalletFormValues = {
    email: "",
    tos: false
  };

  try {
    const ledgerIsSupported = yield neuCall(ensureLedgerIsSupported, baseUiData);
    if (!ledgerIsSupported) {
      return
    }

    while (true) {
      const { email } = yield neuCall(browserLedgerRegisterForm, baseUiData, initialFormValues);
      initialFormValues.email = email;

      const success = yield neuCall(ledgerConnectAndSign, baseUiData);
      if (success) {
        return
      }
    }

    yield neuCall(signInUser, userType, initialFormValues.email, true);

  } finally {
    yield walletSelectorReset();
  }
}

export function* resetWalletSelectorState() {
  yield put(actions.walletSelector.setWalletRegisterData(walletSelectorInitialState));
}

export function* walletSelectorSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.walletSelector.reset, walletSelectorReset);
  yield fork(neuTakeEvery, actions.walletSelector.registerRedirect, walletSelectorRegisterRedirect);
  yield fork(neuTakeLatestUntil, actions.walletSelector.registerWithBrowserWallet, "@@router/LOCATION_CHANGE", browserWalletRegister);
  yield fork(neuTakeLatestUntil, actions.walletSelector.registerWithLightWallet, "@@router/LOCATION_CHANGE", lightWalletRegister);
  yield fork(neuTakeLatestUntil, actions.walletSelector.registerWithLedger, "@@router/LOCATION_CHANGE", ledgerRegister);
}
