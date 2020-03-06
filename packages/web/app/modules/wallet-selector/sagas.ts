import {
  fork,
  neuCall,
  neuTakeEvery,
  neuTakeLatestUntil,
  put,
  race,
  select,
  take,
} from "@neufund/sagas";
import cryptoRandomString from "crypto-random-string";

import { call } from "../../../../sagas/dist/index";
import { EJwtPermissions } from "../../../../shared/dist/utils/constants";
import {
  AuthMessage,
  BrowserWalletErrorMessage,
  ELightWalletRestoreMessage,
  GenericErrorMessage,
} from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { userMayChooseWallet } from "../../components/wallet-selector/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType, IUser } from "../../lib/api/users/interfaces";
import { UserNotExisting } from "../../lib/api/users/UsersApi";
import { BrowserWallet } from "../../lib/web3/browser-wallet/BrowserWallet";
import { getWalletAddress, signMessage } from "../../lib/web3/light-wallet/LightWalletUtils";
import { IPersonalWallet, SignerType } from "../../lib/web3/PersonalWeb3";
import { TAppGlobalState } from "../../store";
import { connectLightWallet } from "../access-wallet/sagas";
import { actions, TActionFromCreator } from "../actions";
import { checkEmailPromise } from "../auth/email/sagas";
import { createJwt } from "../auth/jwt/sagas";
import { handleSignInUser, signInUser } from "../auth/user/sagas";
import { isSupportingLedger } from "../user-agent/reducer";
import { loadPreviousWallet } from "../web3/sagas";
import { EWalletSubType, EWalletType, ILightWalletMetadata } from "../web3/types";
import { mapBrowserWalletErrorToErrorMessage } from "./browser-wizard/errors";
import { mapLedgerErrorToErrorMessage } from "./ledger-wizard/errors";
import { loadLedgerAccounts } from "./ledger-wizard/sagas";
import { DEFAULT_HD_PATH, handleLightWalletError, setupLightWallet } from "./light-wizard/sagas";
import { walletSelectorInitialState } from "./reducer";
import { selectRegisterWalletDefaultFormValues, selectUrlUserType } from "./selectors";
import {
  EBrowserWalletRegistrationFlowState,
  ECommonWalletRegistrationFlowState,
  EFlowType,
  ELedgerRegistrationFlowState,
  TBrowserWalletFormValues,
  TLightWalletFormValues,
} from "./types";

type TBaseUiData = {
  flowType: EFlowType;
  walletType: EWalletType;
  showWalletSelector: boolean;
  rootPath: string;
};

export function* walletSelectorConnect(): Generator<any, any, any> {
  yield put(actions.walletSelector.messageSigning());

  yield neuCall(handleSignInUser);
}

export function* walletSelectorReset(): Generator<any, any, any> {
  yield neuCall(loadPreviousWallet);
}

export function* walletSelectorRegisterRedirect(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.walletSelector.registerRedirect>,
): Generator<any, void, any> {
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

export function* ledgerConnectAndSign(
  { ledgerWalletConnector }: TGlobalDependencies,
  baseUiData: TBaseUiData,
): Generator<any, boolean, any> {
  try {
    while (true) {
      let connectionOk: boolean;
      try {
        yield put(
          actions.walletSelector.setWalletRegisterData({
            ...baseUiData,
            uiState: ELedgerRegistrationFlowState.LEDGER_INIT,
            initialFormValues: (yield* select(
              selectRegisterWalletDefaultFormValues,
            )) as TBrowserWalletFormValues,
          } as const),
        );
        yield ledgerWalletConnector.connect();
        connectionOk = true;
      } catch (e) {
        yield put(
          actions.walletSelector.setWalletRegisterData({
            ...baseUiData,
            uiState: ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
            errorMessage: mapLedgerErrorToErrorMessage(e),
            initialFormValues: (yield* select(
              selectRegisterWalletDefaultFormValues,
            )) as TBrowserWalletFormValues,
          } as const),
        );
        connectionOk = false;
      }
      if (connectionOk) {
        break;
      } else {
        yield take(actions.walletSelector.ledgerReconnect);
      }
    }

    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        uiState: ELedgerRegistrationFlowState.LEDGER_ACCOUNT_CHOOSER,
        initialFormValues: (yield* select(
          selectRegisterWalletDefaultFormValues,
        )) as TBrowserWalletFormValues,
      } as const),
    );

    yield neuCall(loadLedgerAccounts);

    const { aborted } = yield race({
      success: take(actions.walletSelector.ledgerFinishSettingUpLedgerConnector),
      aborted: take(actions.walletSelector.ledgerCloseAccountChooser),
    });

    return !aborted;
  } catch (e) {
    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        uiState: ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
        errorMessage: mapLedgerErrorToErrorMessage(e),
        initialFormValues: (yield* select(
          selectRegisterWalletDefaultFormValues,
        )) as TBrowserWalletFormValues,
      } as const),
    );
    return false;
  }
}

export function* lightWalletConnectAndSign(
  _: TGlobalDependencies,
  baseUiData: TBaseUiData,
  email: string,
  password: string,
): Generator<any, void, any> {
  try {
    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING,
        initialFormValues: (yield* select(
          selectRegisterWalletDefaultFormValues,
        )) as TLightWalletFormValues,
      } as const),
    );

    yield neuCall(setupLightWallet, email, password);
  } catch (e) {
    yield neuCall(handleLightWalletError, e);
  }
}

export function* registerForm(
  { notificationCenter }: TGlobalDependencies,
  expectedAction:
    | typeof actions.walletSelector.lightWalletRegisterFormData
    | typeof actions.walletSelector.browserWalletRegisterFormData,
  initialFormValues: TBrowserWalletFormValues | TLightWalletFormValues,
  baseUiData: TBaseUiData,
): Generator<any, { email: string; password: string } | undefined, any> {
  yield put(
    actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      initialFormValues,
      uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    } as const),
  );

  while (true) {
    const { payload } = yield take(expectedAction);

    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
        initialFormValues: {
          ...initialFormValues,
          email: payload.email,
        },
      } as const),
    );

    let isEmailAvailable = false;
    try {
      isEmailAvailable = yield neuCall(checkEmailPromise, payload.email);
    } catch (e) {
      yield put(
        actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
          initialFormValues: {
            ...initialFormValues,
            email: payload.email,
          },
        } as const),
      );

      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED));
      return;
    }

    if (!isEmailAvailable) {
      const error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);
      yield put(
        actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          uiState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
          errorMessage: error,
          initialFormValues: {
            ...initialFormValues,
            email: payload.email,
          },
        } as const),
      );
    } else {
      return payload;
    }
  }
}

export function* recoveryVerifyEmail(
  { notificationCenter }: TGlobalDependencies,
  baseUiData: TBaseUiData,
  initialFormValues: TLightWalletFormValues,
) {
  while (true) {
    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        initialFormValues,
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
      } as const),
    );

    const {
      payload: { email, password },
    } = yield take(actions.walletSelector.lightWalletRegisterFormData);

    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
        initialFormValues: {
          ...initialFormValues,
          email,
        },
      } as const),
    );

    let isEmailAvailable = false;

    try {
      isEmailAvailable = yield neuCall(checkEmailPromise, email);
    } catch (e) {
      //return to initial form state but with the new email
      yield put(
        actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
          initialFormValues,
        } as const),
      );

      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED));
      return;
    }

    if (!isEmailAvailable) {
      const error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);
      yield put(
        actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          uiState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
          errorMessage: error,
          initialFormValues,
        } as const),
      );
    } else {
      return { password, email };
    }
  }
}

export function* walletRecoverForm(
  { apiUserService, signatureAuthApi }: TGlobalDependencies,
  baseUiData: TBaseUiData,
  seed: string,
): Generator<any, { userType: EUserType; email: string; password: string }, any> {
  const salt = cryptoRandomString({ length: 64 });
  const address = yield getWalletAddress(seed, DEFAULT_HD_PATH);
  const {
    body: { challenge },
  } = yield signatureAuthApi.challenge(address, salt, SignerType.ETH_SIGN, [
    EJwtPermissions.CHANGE_EMAIL_PERMISSION,
  ]);

  yield signMessage(DEFAULT_HD_PATH, seed, challenge);

  let user: IUser | undefined;
  try {
    user = yield* call(() => apiUserService.me());
  } catch (e) {
    if (e instanceof UserNotExisting) {
      user = undefined;
    } else {
      //fixme return to dashboard, show notification
    }
  }

  if (!user) {
    const userType = yield* select((state: TAppGlobalState) => selectUrlUserType(state.router));

    const initialFormValues: TLightWalletFormValues = {
      email: "",
      password: "",
      repeatPassword: "",
      tos: false,
    };
    baseUiData.flowType = EFlowType.IMPORT_WALLET;
    const { email, password } = yield neuCall(recoveryVerifyEmail, baseUiData, initialFormValues);
    return { userType, email, password };
  } else {
    const initialFormValues: TLightWalletFormValues = {
      email: user.verifiedEmail || user.unverifiedEmail || "",
      password: "",
      repeatPassword: "",
      tos: false,
    };

    const { email, password } = yield neuCall(recoveryVerifyEmail, baseUiData, initialFormValues);
    return { userType: user.type, email, password };
  }
}

export function* lightWalletRegister(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.walletSelector.registerWithLightWallet>,
): Generator<any, void, any> {
  yield neuCall(resetWalletSelectorState);

  const baseUiData = {
    walletType: EWalletType.LIGHT,
    showWalletSelector: userMayChooseWallet(payload.userType),
    rootPath: "/register",
    flowType: EFlowType.REGISTER,
  };

  const initialFormValues: TLightWalletFormValues = {
    email: "",
    password: "",
    repeatPassword: "",
    tos: false,
  };

  try {
    const { email, password } = yield neuCall(
      registerForm,
      actions.walletSelector.lightWalletRegisterFormData,
      initialFormValues,
      baseUiData,
    );
    yield neuCall(lightWalletConnectAndSign, baseUiData, email, password);
    yield neuCall(handleSignInUser);
  } finally {
    yield walletSelectorReset();
  }
}

export function* lightWalletRecoverWalletAndSignIn(
  { lightWalletConnector, web3Manager }: TGlobalDependencies,
  password: string,
  walletMetadata: ILightWalletMetadata,
): Generator<any, any, any> {
  try {
    const wallet: IPersonalWallet = yield connectLightWallet(
      lightWalletConnector,
      walletMetadata,
      password,
    );
    yield web3Manager.plugPersonalWallet(wallet);
    yield neuCall(signInUser);

    yield put(
      actions.genericModal.showInfoModal(
        createMessage(ELightWalletRestoreMessage.LIGHT_WALLET_RESTORE_SUCCESS_TITLE),
        createMessage(ELightWalletRestoreMessage.LIGHT_WALLET_RESTORE_SUCCESS_TEXT),
      ),
    );
  } catch (e) {
    yield neuCall(handleLightWalletError, e);
  }
}

export function* createUserObject(
  _: TGlobalDependencies,
  email: string,
  password: string,
  seed: string,
  userType: EUserType,
) {
  const walletMetadata = yield* neuCall(setupLightWallet, email, password, seed);
  yield neuCall(createJwt, [EJwtPermissions.CHANGE_EMAIL_PERMISSION]);

  const newUser = {
    salt: walletMetadata.salt,
    backupCodesVerified: true,
    type: userType,
    walletType: walletMetadata.walletType,
    walletSubtype: EWalletSubType.UNKNOWN,
    newEmail: email,
  };

  return { walletMetadata, newUser };
}

export function* lightWalletRestore(_: TGlobalDependencies): Generator<any, void, any> {
  const baseUiData = {
    walletType: EWalletType.LIGHT,
    flowType: EFlowType.RESTORE_WALLET,
    showWalletSelector: false,
    rootPath: "/restore",
  };

  yield neuCall(resetWalletSelectorState);
  const {
    payload: { seed },
  } = yield take(actions.walletSelector.submitSeed);

  try {
    const { userType, email, password } = yield neuCall(walletRecoverForm, baseUiData, seed);
    yield* neuCall(setupLightWallet, email, password, seed);
    yield neuCall(signInUser, userType, email, true);
  } catch (e) {
    //fixme error handling
  } finally {
    yield walletSelectorReset();
  }
}

export function* browserWalletRegister(
  _: TGlobalDependencies,
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

    try {
      yield neuCall(signInUser, userType, email, true);
    } catch (e) {
      //fixme error handling
    }
  } finally {
    yield walletSelectorReset();
  }
}

export function* ensureLedgerIsSupported(
  _: TGlobalDependencies,
  baseUiData: TBaseUiData,
): Generator<any, boolean, any> {
  const ledgerIsSupported = yield* select(isSupportingLedger);
  if (!ledgerIsSupported) {
    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        initialFormValues: {
          email: "",
          tos: false,
        },
        uiState: ELedgerRegistrationFlowState.LEDGER_NOT_SUPPORTED,
      } as const),
    );
  }
  return ledgerIsSupported;
}

export function* ledgerRegister(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.walletSelector.registerWithLedger>,
): Generator<any, void, any> {
  yield neuCall(resetWalletSelectorState);

  const userType = payload.userType;
  const baseUiData = {
    walletType: EWalletType.LEDGER,
    showWalletSelector: userMayChooseWallet(userType),
    rootPath: "/register",
    flowType: EFlowType.REGISTER,
  };

  const initialFormValues: TBrowserWalletFormValues = {
    email: "",
    tos: false,
  };

  try {
    const ledgerIsSupported = yield neuCall(ensureLedgerIsSupported, baseUiData);
    if (!ledgerIsSupported) {
      return;
    }

    while (true) {
      const { email } = yield neuCall(
        registerForm,
        actions.walletSelector.browserWalletRegisterFormData,
        initialFormValues,
        baseUiData,
      );
      initialFormValues.email = email;

      const success = yield neuCall(ledgerConnectAndSign, baseUiData);
      if (success) {
        return;
      }
    }

    yield neuCall(signInUser, userType, initialFormValues.email, true);
  } catch (e) {
    //fixme error handling
  } finally {
    yield walletSelectorReset();
  }
}

export function* resetWalletSelectorState(): Generator<any, void, any> {
  yield put(actions.walletSelector.setWalletRegisterData(walletSelectorInitialState));
}

export function* walletSelectorSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.walletSelector.reset, walletSelectorReset);
  yield fork(neuTakeEvery, actions.walletSelector.registerRedirect, walletSelectorRegisterRedirect);
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.registerWithBrowserWallet,
    "@@router/LOCATION_CHANGE",
    browserWalletRegister,
  );
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.registerWithLightWallet,
    "@@router/LOCATION_CHANGE",
    lightWalletRegister,
  );
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.registerWithLedger,
    "@@router/LOCATION_CHANGE",
    ledgerRegister,
  );
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.restoreLightWallet,
    "@@router/LOCATION_CHANGE",
    lightWalletRestore,
  );
}
