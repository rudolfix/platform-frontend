import { effects } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";

import { TUserType } from "../../../lib/api/users/interfaces";
import { ILightWalletRetrieveMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
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
import { updateUserPromise } from "../../auth/sagas";
import { displayInfoModalSaga } from "../../genericModal/sagas";
import { neuCall, neuTakeEvery } from "../../sagas";
import { selectIsUnlocked, selectLightWalletFromQueryString } from "../../web3/selectors";
import { WalletType } from "../../web3/types";
import { selectUrlUserType } from "../selectors";
import { TGlobalDependencies } from "./../../../di/setupBindings";
import { mapLightWalletErrorToErrorMessage } from "./errors";
import { getVaultKey } from "./flows";

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
  { walletMetadataStorage }: TGlobalDependencies,
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

  const savedMetadata = walletMetadataStorage.get();
  if (savedMetadata && savedMetadata.walletType === WalletType.LIGHT) {
    return savedMetadata;
  }

  return undefined;
}

export function* lightWalletBackupWatch(): Iterator<any> {
  try {
    const user = yield select((state: IAppState) => state.auth.user);
    yield neuCall(updateUserPromise, { ...user, backupCodesVerified: true });
    yield neuCall(displayInfoModalSaga, "Backup Seed", "you have successfully back up your wallet");
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
    //How should you bind instances when using call?
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
  { web3Manager, walletMetadataStorage, lightWalletConnector }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "LIGHT_WALLET_LOGIN") {
    return;
  }
  const { password } = action.payload;
  const userType: TUserType = yield effects.select((s: IAppState) => selectUrlUserType(s.router));

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

    walletMetadataStorage.set(wallet.getMetadata());
    yield web3Manager.plugPersonalWallet(wallet);
    yield put(actions.walletSelector.connected(userType));
  } catch (e) {
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* lightWalletSagas(): Iterator<any> {
  yield fork(neuTakeEvery, "LIGHT_WALLET_LOGIN", lightWalletLoginWatch);
  yield fork(neuTakeEvery, "LIGHT_WALLET_BACKUP", lightWalletBackupWatch);
  yield fork(neuTakeEvery, "WEB3_FETCH_SEED", loadSeedFromWalletWatch);
}
