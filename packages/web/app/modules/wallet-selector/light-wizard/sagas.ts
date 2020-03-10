import { call, fork, neuTakeLatestUntil, put, select, take } from "@neufund/sagas";
import { invariant } from "@neufund/shared";
import cryptoRandomString from "crypto-random-string";
import { includes } from "lodash";

import { EJwtPermissions } from "../../../../../shared/dist/utils/constants";
import {
  BackupRecoveryMessage,
  GenericErrorMessage,
  GenericModalMessage,
  SignInUserErrorMessage,
} from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { userMayChooseWallet } from "../../../components/wallet-selector/WalletSelectorLogin/utils";
import { USERS_WITH_ACCOUNT_SETUP } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { IUser } from "../../../lib/api/users/interfaces";
import { EmailAlreadyExists, UserNotExisting } from "../../../lib/api/users/UsersApi";
import {
  LightError,
  LightWallet,
  LightWalletLocked,
} from "../../../lib/web3/light-wallet/LightWallet";
import {
  createLightWalletVault,
  deserializeLightWalletVault,
  getWalletAddress,
  signMessage,
} from "../../../lib/web3/light-wallet/LightWalletUtils";
import { SignerType } from "../../../lib/web3/PersonalWeb3";
import { TAppGlobalState } from "../../../store";
import { connectLightWallet } from "../../access-wallet/sagas";
import { actions, TActionFromCreator } from "../../actions";
import { checkEmailPromise } from "../../auth/email/sagas";
import { selectUserType } from "../../auth/selectors";
import { loadUser, updateUser } from "../../auth/user/external/sagas";
import { handleSignInUser, signInUser } from "../../auth/user/sagas";
import { userHasKycAndEmailVerified } from "../../eto-flow/selectors";
import { displayInfoModalSaga } from "../../generic-modal/sagas";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { selectIsUnlocked } from "../../web3/selectors";
import { EWalletType, ILightWalletMetadata } from "../../web3/types";
import {
  registerForm,
  resetWalletSelectorState,
  TBaseUiData,
  walletSelectorConnect,
  walletSelectorReset,
} from "../sagas";
import { AuthMessage } from "./../../../components/translatedMessages/messages";
import { EUserType } from "./../../../lib/api/users/interfaces";
import { selectRegisterWalletDefaultFormValues, selectUrlUserType } from "./../selectors";
import { ECommonWalletRegistrationFlowState, EFlowType, TLightWalletFormValues } from "./../types";
import { mapLightWalletErrorToErrorMessage } from "./errors";
import { getWalletMetadataByURL } from "./metadata/sagas";
import { getVaultKey } from "./utils";

export const DEFAULT_HD_PATH = "m/44'/60'/0'";

export function* setupLightWallet(
  { vaultApi, lightWalletConnector, web3Manager, logger }: TGlobalDependencies,
  email: string,
  password: string,
  seed?: string,
): Generator<any, ILightWalletMetadata, any> {
  try {
    const { salt, serializedLightWallet } = yield* call(createLightWalletVault, {
      password,
      hdPathString: DEFAULT_HD_PATH,
      recoverSeed: seed,
    });

    const walletInstance = yield* call(deserializeLightWalletVault, serializedLightWallet, salt);

    const vaultKey = yield* call(getVaultKey, salt, password);
    yield vaultApi.store(vaultKey, serializedLightWallet);
    const lightWallet = yield* call(
      lightWalletConnector.connect,
      {
        walletInstance,
        salt,
      },
      email,
      password,
    );

    yield web3Manager.plugPersonalWallet(lightWallet);
    return lightWallet.getMetadata() as ILightWalletMetadata;
  } catch (e) {
    logger.warn("Error while trying to connect with light wallet: ", e);
    throw e;
  }
}

export function* lightWalletBackupWatch({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    const user: IUser = yield select((state: TAppGlobalState) => state.auth.user);
    yield neuCall(updateUser, { ...user, backupCodesVerified: true });
    yield call(
      displayInfoModalSaga,
      createMessage(BackupRecoveryMessage.BACKUP_SUCCESS_TITLE),
      createMessage(BackupRecoveryMessage.BACKUP_SUCCESS_DESCRIPTION),
    );
    yield neuCall(loadUser);

    const userType = yield select(selectUserType);
    const kycAndEmailVerified = yield select(userHasKycAndEmailVerified);

    if (!kycAndEmailVerified && includes(USERS_WITH_ACCOUNT_SETUP, userType)) {
      yield put(actions.routing.goToDashboard());
    } else {
      yield put(actions.routing.goToProfile());
    }
  } catch (e) {
    logger.error("Light Wallet Backup Error", e);
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* loadSeedFromWalletWatch({
  logger,
  web3Manager,
}: TGlobalDependencies): Generator<any, any, any> {
  try {
    const isUnlocked = yield* select((s: TAppGlobalState) => selectIsUnlocked(s.web3));

    if (!isUnlocked) {
      yield put(
        actions.walletSelector.lightWalletConnectionError(
          mapLightWalletErrorToErrorMessage(new LightWalletLocked()),
        ),
      );
      return;
    }
    const lightWallet = web3Manager.personalWallet as LightWallet;
    const { seed, privateKey } = yield* call(lightWallet.getWalletPrivateData);
    yield put(actions.web3.loadWalletPrivateDataToState(seed, privateKey));
  } catch (e) {
    logger.error("Load seed from wallet failed", e);
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* handleLightWalletError({ logger }: TGlobalDependencies, e: Error): any {
  yield put(actions.walletSelector.reset());

  let error;

  if (e instanceof EmailAlreadyExists) {
    error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);
  } else if (e instanceof LightError) {
    logger.error("Light wallet recovery/register error", e);
    error = mapLightWalletErrorToErrorMessage(e);
  } else {
    error = createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE);
  }

  yield put(
    actions.genericModal.showErrorModal(createMessage(GenericModalMessage.ERROR_TITLE), error),
  );
}

export function* lightWalletLoginWatch(
  { web3Manager, lightWalletConnector, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.walletSelector.lightWalletLogin>,
): Generator<any, any, any> {
  const { password } = action.payload;

  try {
    const walletMetadata = yield* getWalletMetadataByURL(password);

    if (!walletMetadata) {
      yield invariant(walletMetadata, "Missing metadata");
      return;
    }

    const wallet = yield* connectLightWallet(
      lightWalletConnector,
      walletMetadata as ILightWalletMetadata,
      password,
    );

    yield web3Manager.plugPersonalWallet(wallet);
    yield walletSelectorConnect();
  } catch (e) {
    logger.error("Light Wallet login error", e);
    yield put(actions.walletSelector.reset());
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* recoveryVerifyEmail(
  { notificationCenter }: TGlobalDependencies,
  baseUiData: TBaseUiData,
  initialFormValues: TLightWalletFormValues,
  userEmail?: string,
): Generator<any, any, any> {
  while (true) {
    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        initialFormValues,
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
      }),
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
      }),
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
        }),
      );

      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED));
      return;
    }

    if (!isEmailAvailable && userEmail !== email) {
      const error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);
      yield put(
        actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          uiState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
          errorMessage: error,
          initialFormValues,
        }),
      );
    } else {
      return { password, email };
    }
  }
}

/**
 *
 * @returns IUser or undefined depending on if the user exists or not
 * @param seed
 */
export function* getUserMeWithoutLogin(
  { apiUserService, signatureAuthApi }: TGlobalDependencies,
  seed: string,
): Generator<any, IUser | undefined, any> {
  const salt = cryptoRandomString({ length: 64 });
  const address = yield getWalletAddress(seed, DEFAULT_HD_PATH);

  //We can't use `getSignerType` at the moment as the wallet is not plugged
  const {
    body: { challenge },
  } = yield signatureAuthApi.challenge(address, salt, SignerType.ETH_SIGN, [
    EJwtPermissions.CHANGE_EMAIL_PERMISSION,
  ]);

  const signedChallenge = yield* call(() => signMessage(DEFAULT_HD_PATH, seed, challenge));

  const { jwt } = yield* call(() =>
    signatureAuthApi.createJwt(challenge, signedChallenge, SignerType.ETH_SIGN),
  );

  try {
    const user = yield* call(() => apiUserService.meWithJWT(jwt));
    return user;
  } catch (e) {
    if (e instanceof UserNotExisting) {
      return undefined;
    } else {
      throw e;
    }
  }
}

export function* walletRecoverForm(
  _: TGlobalDependencies,
  baseUiData: TBaseUiData,
  seed: string,
): Generator<any, { userType: EUserType; email: string; password: string }, any> {
  const userTypeFromUrl = yield* select((state: TAppGlobalState) =>
    selectUrlUserType(state.router),
  );

  const user = yield* neuCall(getUserMeWithoutLogin, seed);
  const userEmail = user?.verifiedEmail || user?.unverifiedEmail || "";

  const { email, password } = yield neuCall(
    recoveryVerifyEmail,
    { ...baseUiData, flowType: user ? EFlowType.RESTORE_WALLET : EFlowType.IMPORT_WALLET },
    {
      email: userEmail,
      password: "",
      repeatPassword: "",
      tos: false,
    },
    userEmail,
  );
  return { userType: user?.type || userTypeFromUrl, email, password };
}

export function* lightWalletConnectAndSign(
  _: TGlobalDependencies,
  baseUiData: TBaseUiData,
  email: string,
  password: string,
): Generator<any, void, any> {
  try {
    const registerFormDefaultValues = yield* select(selectRegisterWalletDefaultFormValues);

    if (!registerFormDefaultValues) {
      throw new Error("registerFormDefaultValues should be defined at this stage");
    }
    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING,
        initialFormValues: registerFormDefaultValues,
      }),
    );

    yield neuCall(setupLightWallet, email, password);
  } catch (e) {
    yield neuCall(handleLightWalletError, e);
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
    const { email, password, tos } = yield neuCall(
      registerForm,
      actions.walletSelector.lightWalletRegisterFormData,
      initialFormValues,
      baseUiData,
    );
    yield neuCall(lightWalletConnectAndSign, baseUiData, email, password);
    yield neuCall(handleSignInUser, email, tos);
  } finally {
    yield walletSelectorReset();
  }
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

export function* lightWalletSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.walletSelector.lightWalletLogin, lightWalletLoginWatch);
  yield fork(neuTakeEvery, actions.walletSelector.lightWalletBackedUp, lightWalletBackupWatch);
  yield fork(neuTakeEvery, "WEB3_FETCH_SEED", loadSeedFromWalletWatch);
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.restoreLightWallet,
    "@@router/LOCATION_CHANGE",
    lightWalletRestore,
  );
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.registerWithLightWallet,
    "@@router/LOCATION_CHANGE",
    lightWalletRegister,
  );
}
