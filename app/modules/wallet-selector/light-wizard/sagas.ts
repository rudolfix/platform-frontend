import { effects } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";

import { CHANGE_EMAIL_PERMISSION } from "../../../config/constants";
import {
  ILightWalletMetadata,
  ILightWalletRetrieveMetadata,
} from "../../../lib/persistence/WalletMetadataObjectStorage";
import {
  LightWallet,
  LightWalletLocked,
  LightWalletUtil,
  LightWalletWrongPassword,
} from "../../../lib/web3/LightWallet";
import { IAppState } from "../../../store";
import { invariant } from "../../../utils/invariant";
import { connectLightWallet } from "../../accessWallet/sagas";
import { actions, TAction } from "../../actions";
import { loadUser, obtainJWT, updateUser, updateUserPromise } from "../../auth/sagas";
import { displayInfoModalSaga } from "../../genericModal/sagas";
import { neuCall, neuTakeEvery } from "../../sagas";
import {
  selectIsUnlocked,
  selectLightWalletFromQueryString,
  selectPreviousConnectedWallet,
} from "../../web3/selectors";
import { WalletType } from "../../web3/types";
import { selectUrlUserType } from "../selectors";
import { TGlobalDependencies } from "./../../../di/setupBindings";
import { mapLightWalletErrorToErrorMessage } from "./errors";
import { DEFAULT_HD_PATH, getVaultKey } from "./flows";

export async function retrieveMetadataFromVaultAPI(
  { lightWalletUtil, vaultApi }: TGlobalDependencies,
  password: string,
  salt: string,
  email: string,
): Promise<ILightWalletRetrieveMetadata> {
  const vaultKey = await getVaultKey(lightWalletUtil, salt, password);
  try {
    const vault = await vaultApi.retrieve(vaultKey);

    return {
      walletType: WalletType.LIGHT,
      salt,
      vault,
      email,
    };
  } catch {
    throw new LightWalletWrongPassword();
  }
}

export function* getWalletMetadata(
  _: TGlobalDependencies,
  password: string,
): Iterator<any | ILightWalletRetrieveMetadata | undefined> {
  const queryStringWalletInfo: { email: string; salt: string } | undefined = yield select(
    (s: IAppState) => selectLightWalletFromQueryString(s.router),
  );
  if (queryStringWalletInfo) {
    return yield neuCall(
      retrieveMetadataFromVaultAPI,
      password,
      queryStringWalletInfo.salt,
      queryStringWalletInfo.email,
    );
  }
  const savedMetadata = yield effects.select((s: IAppState) =>
    selectPreviousConnectedWallet(s.web3),
  );
  if (savedMetadata && savedMetadata.walletType === WalletType.LIGHT) {
    return savedMetadata;
  }

  return undefined;
}

export async function setupLightWalletPromise(
  { lightWalletUtil, vaultApi, lightWalletConnector, web3Manager, logger }: TGlobalDependencies,
  email: string,
  password: string,
  seed: string,
): Promise<ILightWalletMetadata> {
  try {
    const lightWalletVault = await lightWalletUtil.createLightWalletVault({
      password,
      hdPathString: DEFAULT_HD_PATH,
      recoverSeed: seed,
    });
    const walletInstance = await lightWalletUtil.deserializeLightWalletVault(
      lightWalletVault.walletInstance,
      lightWalletVault.salt,
    );

    const vaultKey = await getVaultKey(lightWalletUtil, lightWalletVault.salt, password);
    await vaultApi.store(vaultKey, lightWalletVault.walletInstance);

    const lightWallet = await lightWalletConnector.connect(
      {
        walletInstance,
        salt: lightWalletVault.salt,
      },
      email,
      password,
    );

    const walletMetadata = lightWallet.getMetadata();
    await web3Manager.plugPersonalWallet(lightWallet);

    if (walletMetadata && walletMetadata.walletType === WalletType.LIGHT) {
      return walletMetadata;
    } else throw new Error(`Wallet ${walletMetadata.walletType} is not a lightwallet`);
  } catch (e) {
    logger.warn("Error while trying to connect with light wallet: ", e.message);
    throw e;
  }
}

export function* lightWalletRecoverWatch(_: TGlobalDependencies, action: TAction): Iterator<any> {
  try {
    const userType = yield select((state: IAppState) => selectUrlUserType(state.router));

    if (action.type !== "LIGHT_WALLET_RECOVER") {
      return;
    }
    const { password, email, seed } = action.payload;
    const walletMetadata = yield neuCall(setupLightWalletPromise, email, password, seed, userType);

    yield neuCall(obtainJWT, [CHANGE_EMAIL_PERMISSION]);

    yield effects.call(updateUser, {
      newEmail: email,
      salt: walletMetadata.salt,
      backupCodesVerified: false,
      type: userType,
    });

    yield put(actions.routing.goToSuccessfulRecovery());
  } catch (e) {
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletBackupWatch({
  intlWrapper: { intl: { formatIntlMessage } },
}: TGlobalDependencies): Iterator<any> {
  try {
    const user = yield select((state: IAppState) => state.auth.user);
    yield neuCall(updateUserPromise, { ...user, backupCodesVerified: true });
    yield neuCall(
      displayInfoModalSaga,
      formatIntlMessage("modules.wallet-selector.light-wizard.sagas.backup-recovery"),
      formatIntlMessage("modules.wallet-selector.light-wizard.sagas.successfully.backed-up"),
    );
    yield effects.call(loadUser);
    yield effects.put(actions.routing.goToSettings());
  } catch (e) {
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* loadSeedFromWallet({ web3Manager }: TGlobalDependencies): Iterator<any> {
  const isUnlocked = yield select((s: IAppState) => selectIsUnlocked(s.web3));
  if (!isUnlocked) {
    throw new LightWalletLocked();
  }
  try {
    const lightWallet = web3Manager.personalWallet as LightWallet;
    const seed = yield call(lightWallet.getSeed.bind(lightWallet));
    yield put(actions.web3.loadSeedToState(seed));
  } catch (e) {
    throw new Error("Fetching seed failed");
  }
}

export function* loadSeedFromWalletWatch(): Iterator<any> {
  try {
    yield neuCall(loadSeedFromWallet);
  } catch (e) {
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletLoginWatch(
  { web3Manager, lightWalletConnector }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "LIGHT_WALLET_LOGIN") {
    return;
  }
  const { password } = action.payload;

  try {
    const walletMetadata: ILightWalletRetrieveMetadata | undefined = yield neuCall(
      getWalletMetadata,
      password,
    );

    if (!walletMetadata) {
      invariant(walletMetadata, "Missing metadata");
      return;
    }
    const wallet: LightWallet = yield connectLightWallet(
      lightWalletConnector,
      walletMetadata,
      password,
    );
    const isValidPassword: boolean = yield LightWalletUtil.testWalletPassword(
      wallet.vault.walletInstance,
      password,
    );
    if (!isValidPassword) {
      throw new LightWalletWrongPassword();
    }

    yield web3Manager.plugPersonalWallet(wallet);
    yield put(actions.walletSelector.connected());
  } catch (e) {
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletSagas(): Iterator<any> {
  yield fork(neuTakeEvery, "LIGHT_WALLET_LOGIN", lightWalletLoginWatch);
  yield fork(neuTakeEvery, "LIGHT_WALLET_BACKUP", lightWalletBackupWatch);
  yield fork(neuTakeEvery, "LIGHT_WALLET_RECOVER", lightWalletRecoverWatch);
  yield fork(neuTakeEvery, "WEB3_FETCH_SEED", loadSeedFromWalletWatch);
}
