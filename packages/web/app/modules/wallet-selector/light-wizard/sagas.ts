import { call, fork, neuTakeLatestUntil, put, select, take } from "@neufund/sagas";
import { invariant } from "@neufund/shared";
import { includes } from "lodash";

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
import { EmailAlreadyExists } from "../../../lib/api/users/UsersApi";
import {
  LightError,
  LightWallet,
  LightWalletLocked,
} from "../../../lib/web3/light-wallet/LightWallet";
import { TAppGlobalState } from "../../../store";
import { connectLightWallet } from "../../access-wallet/sagas";
import { actions, TActionFromCreator } from "../../actions";
import { selectUserType } from "../../auth/selectors";
import { loadUser, updateUser } from "../../auth/user/external/sagas";
import { signInUser } from "../../auth/user/sagas";
import { userHasKycAndEmailVerified } from "../../eto-flow/selectors";
import { displayInfoModalSaga } from "../../generic-modal/sagas";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { selectIsUnlocked } from "../../web3/selectors";
import { EWalletType, ILightWalletMetadata } from "../../web3/types";
import { registerForm, walletRecoverForm } from "../forms/sagas";
import { resetWalletSelectorState, walletSelectorConnect } from "../sagas";
import { selectRegisterWalletDefaultFormValues } from "../selectors";
import { ECommonWalletRegistrationFlowState, EFlowType, TLightWalletFormValues } from "./../types";
import { mapLightWalletErrorToErrorMessage } from "./errors";
import { getWalletMetadataByURL } from "./metadata/sagas";
import { ERecoveryPhase } from "./reducer";
import { setupLightWallet } from "./signing/sagas";

export const DEFAULT_HD_PATH = "m/44'/60'/0'";

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

export function* lightWalletRegister(
  _: TGlobalDependencies,
  {
    payload: { userType },
  }: TActionFromCreator<typeof actions.walletSelector.registerWithLightWallet>,
): Generator<any, void, any> {
  yield neuCall(resetWalletSelectorState);

  const baseUiData = {
    walletType: EWalletType.LIGHT,
    showWalletSelector: userMayChooseWallet(userType),
    rootPath: "/register",
    flowType: EFlowType.REGISTER,
  };

  const initialFormValues: TLightWalletFormValues = {
    email: "",
    password: "",
    repeatPassword: "",
    tos: false,
  };
  while (true) {
    try {
      const { email, password, tos } = yield neuCall(
        registerForm,
        actions.walletSelector.lightWalletRegisterFormData,
        initialFormValues,
        baseUiData,
      );

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
      yield neuCall(setupLightWallet, email, password, undefined);
      yield neuCall(signInUser, userType, email, tos);
      return;
    } catch (e) {
      yield neuCall(handleLightWalletError, e);
      const registerFormDefaultValues = yield* select(selectRegisterWalletDefaultFormValues);

      yield put(
        actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
          initialFormValues: registerFormDefaultValues || initialFormValues,
        }),
      );
    }
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
  yield put(actions.walletSelector.setRecoveryPhase(ERecoveryPhase.FORM_ENTRY_COMPONENT));
  try {
    const { userType, email, password } = yield neuCall(walletRecoverForm, baseUiData, seed);
    yield* neuCall(setupLightWallet, email, password, seed);
    yield neuCall(signInUser, userType, email, true);
  } catch (e) {
    yield neuCall(handleLightWalletError, e);
    yield neuCall(resetWalletSelectorState);
    yield put(actions.walletSelector.setRecoveryPhase(ERecoveryPhase.SEED_ENTRY_COMPONENT));
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
