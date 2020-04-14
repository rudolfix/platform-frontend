import { call, fork, put, select } from "@neufund/sagas";
import { invariant } from "@neufund/shared";
import {
  authModuleAPI,
  EJwtPermissions,
  EWalletSubType,
  IUser,
  IUserInput,
  neuGetBindings,
} from "@neufund/shared-modules";
import { includes } from "lodash";

import {
  BackupRecoveryMessage,
  GenericErrorMessage,
  GenericModalMessage,
  SignInUserErrorMessage,
} from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { USERS_WITH_ACCOUNT_SETUP } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import {
  LightError,
  LightWallet,
  LightWalletLocked,
} from "../../../lib/web3/light-wallet/LightWallet";
import {
  createLightWalletVault,
  deserializeLightWalletVault,
} from "../../../lib/web3/light-wallet/LightWalletUtils";
import { IPersonalWallet } from "../../../lib/web3/PersonalWeb3";
import { TAppGlobalState } from "../../../store";
import { connectLightWallet } from "../../access-wallet/sagas";
import { actions, TActionFromCreator } from "../../actions";
import { checkEmailPromise } from "../../auth/email/sagas";
import { selectUserType } from "../../auth/selectors";
import { loadUser, logoutUser, updateUser } from "../../auth/user/external/sagas";
import { userHasKycAndEmailVerified } from "../../eto-flow/selectors";
import { displayInfoModalSaga } from "../../generic-modal/sagas";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { selectIsUnlocked } from "../../web3/selectors";
import { ILightWalletMetadata } from "../../web3/types";
import { selectUrlUserType } from "../selectors";
import { mapLightWalletErrorToErrorMessage } from "./errors";
import { getWalletMetadataByURL } from "./metadata/sagas";
import { getVaultKey } from "./utils";

export const DEFAULT_HD_PATH = "m/44'/60'/0'";

export async function setupLightWalletPromise(
  { vaultApi, lightWalletConnector, web3Manager, logger }: TGlobalDependencies,
  email: string,
  password: string,
  seed?: string,
): Promise<ILightWalletMetadata> {
  try {
    const lightWalletVault = await createLightWalletVault({
      password,
      hdPathString: DEFAULT_HD_PATH,
      recoverSeed: seed,
    });
    const walletInstance = await deserializeLightWalletVault(
      lightWalletVault.walletInstance,
      lightWalletVault.salt,
    );

    const vaultKey = await getVaultKey(lightWalletVault.salt, password);
    await vaultApi.store(vaultKey, lightWalletVault.walletInstance);

    const lightWallet = await lightWalletConnector.connect(
      {
        walletInstance,
        salt: lightWalletVault.salt,
      },
      email,
      password,
    );

    await web3Manager.plugPersonalWallet(lightWallet);
    return lightWallet.getMetadata() as ILightWalletMetadata;
  } catch (e) {
    logger.warn("Error while trying to connect with light wallet: ", e);
    throw e;
  }
}

export function* lightWalletBackupWatch({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    const user: IUser = yield select(authModuleAPI.selectors.selectUser);
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

export function* lightWalletRecoverWatch(
  { lightWalletConnector, web3Manager, vaultApi }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.walletSelector.lightWalletRecover>,
): Generator<unknown, void> {
  const { apiUserService } = yield* neuGetBindings({
    apiUserService: authModuleAPI.symbols.apiUserService,
  });

  const { password, email, seed } = action.payload;

  try {
    const userType = yield* select((state: TAppGlobalState) => selectUrlUserType(state.router));
    const walletMetadata = yield* neuCall(setupLightWalletPromise, email, password, seed);
    yield neuCall(authModuleAPI.sagas.createJwt, [EJwtPermissions.CHANGE_EMAIL_PERMISSION]);

    const userUpdate: IUserInput = {
      salt: walletMetadata.salt,
      backupCodesVerified: true,
      type: userType,
      walletType: walletMetadata.walletType,
      walletSubtype: EWalletSubType.UNKNOWN,
    };

    const isEmailAvailable = yield neuCall(checkEmailPromise, email);

    try {
      const user = yield* call(() => apiUserService.me());

      if (isEmailAvailable) {
        userUpdate.newEmail = walletMetadata.email;
      } else if (user.verifiedEmail !== email.toLowerCase()) {
        yield neuCall(handleLightWalletError, new authModuleAPI.error.EmailAlreadyExists());
        return;
      }

      yield apiUserService.updateUser(userUpdate);
    } catch (e) {
      if (e instanceof authModuleAPI.error.UserNotExisting) {
        if (!isEmailAvailable) {
          yield neuCall(handleLightWalletError, new authModuleAPI.error.EmailAlreadyExists());
          return;
        }
        userUpdate.newEmail = walletMetadata.email;
        yield apiUserService.createAccount(userUpdate);
      } else {
        yield neuCall(handleLightWalletError, e);
        return;
      }
    }

    const wallet: IPersonalWallet = yield* call(() =>
      connectLightWallet(lightWalletConnector, walletMetadata, password),
    );
    yield web3Manager.plugPersonalWallet(wallet);

    const vaultKey = yield* call(getVaultKey, walletMetadata.salt, password);
    yield vaultApi.confirm(vaultKey);

    yield neuCall(logoutUser);

    yield put(actions.routing.goToSuccessfulRecovery());
  } catch (e) {
    yield neuCall(handleLightWalletError, e);
  }
}

export function* lightWalletRegisterWatch(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.walletSelector.lightWalletRegister>,
): Generator<any, any, any> {
  const { password, email } = action.payload;

  try {
    const isEmailAvailable = yield neuCall(checkEmailPromise, email);

    if (!isEmailAvailable) {
      yield neuCall(handleLightWalletError, new authModuleAPI.error.EmailAlreadyExists());
      return;
    }

    yield neuCall(setupLightWalletPromise, email, password);
    yield put(actions.walletSelector.connected());
  } catch (e) {
    yield neuCall(handleLightWalletError, e);
  }
}

function* handleLightWalletError({ logger }: TGlobalDependencies, e: Error): any {
  yield put(actions.walletSelector.reset());

  let error;

  if (e instanceof authModuleAPI.error.EmailAlreadyExists) {
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

    const wallet = yield* connectLightWallet(lightWalletConnector, walletMetadata as any, password);
    // TODO-UPDATE-SAGAS: FIX THIS ANOMALY

    yield web3Manager.plugPersonalWallet(wallet);
    yield put(actions.walletSelector.connected());
  } catch (e) {
    logger.error("Light Wallet login error", e);
    yield put(actions.walletSelector.reset());
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.walletSelector.lightWalletLogin, lightWalletLoginWatch);
  yield fork(neuTakeEvery, actions.walletSelector.lightWalletRegister, lightWalletRegisterWatch);
  yield fork(neuTakeEvery, actions.walletSelector.lightWalletBackedUp, lightWalletBackupWatch);
  yield fork(neuTakeEvery, actions.walletSelector.lightWalletRecover, lightWalletRecoverWatch);
  yield fork(neuTakeEvery, "WEB3_FETCH_SEED", loadSeedFromWalletWatch);
}
