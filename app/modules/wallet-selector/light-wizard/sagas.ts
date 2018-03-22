import { effects } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";
import { ILightWalletRetrieveMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import {
  LightWallet,
  LightWalletLocked,
  LightWalletUtil,
  LightWalletWrongPassword,
} from "../../../lib/web3/LightWallet";
import { IAppState } from "../../../store";
import { invariant } from "../../../utils/invariant";
import { actions, TAction } from "../../actions";
import { updateUser } from "../../auth/sagas";
import { neuCall, neuTakeEvery } from "../../sagas";
import { connectLightWallet } from "../../signMessageModal/sagas";
import { selectIsUnlocked, selectLightWalletFromQueryString } from "../../web3/reducer";
import { WalletType } from "../../web3/types";
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

export function* lightWalletBackupWatch({ getState }: TGlobalDependencies): Iterator<any> {
  try {
    const user = getState().auth.user;
    yield effects.call(updateUser, { ...user, backupCodesVerified: true });
    yield effects.put(actions.routing.goToSettings());
  } catch (e) {
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* loadSeedFromWallet({ web3Manager }: TGlobalDependencies): Iterator<any> {
  const isUnlocked = yield select((s: IAppState) => selectIsUnlocked(s.web3State));
  if (!isUnlocked) {
    throw new LightWalletLocked();
  }
  try {
    const lightWallet = web3Manager.personalWallet as LightWallet;
    //How should you bind instances when using call?
    const seed = yield call(lightWallet.getSeed.bind(lightWallet));
    yield put(actions.web3.loadSeedtoState(seed));
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
  yield fork(neuTakeEvery, "WEB3_FETCH_SEED", loadSeedFromWalletWatch);
}
