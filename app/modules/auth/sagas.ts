import { effects } from "redux-saga";
import { Effect, fork } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IUser } from "../../lib/api/users/interfaces";
import { UserNotExisting } from "../../lib/api/users/UsersApi";
import { actions } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";
import { WalletType } from "../web3/types";

export function* loadJwt({ jwtStorage }: TGlobalDependencies): Iterator<Effect> {
  const jwt = jwtStorage.get();
  if (jwt) {
    yield effects.put(actions.auth.loadJWT(jwt));
    return jwt;
  }
}

export async function loadUserPromise({
  apiUserSerivce,
  walletMetadataStorage,
}: TGlobalDependencies): Promise<IUser> {
  try {
    return await apiUserSerivce.me();
  } catch (e) {
    if (!(e instanceof UserNotExisting)) {
      throw e;
    }
  }
  // for light wallet we need to send slightly different request
  const walletMetadata = walletMetadataStorage.get();
  if (walletMetadata && walletMetadata.walletType === WalletType.LIGHT) {
    return apiUserSerivce.createAccount({
      unverifiedEmail: walletMetadata.email,
      salt: walletMetadata.salt,
      backupCodesVerified: false,
    });
  } else {
    return apiUserSerivce.createAccount();
  }
}

export async function updateUserPromise(
  { apiUserSerivce }: TGlobalDependencies,
  user: IUser,
): Promise<IUser> {
  await apiUserSerivce.me();
  return apiUserSerivce.updateUser(user);
}

export function* loadUser(): Iterator<any> {
  const user: IUser = yield neuCall(loadUserPromise);
  yield effects.put(actions.auth.loadUser(user));
}

export function* updateUser(updatedUser: IUser): Iterator<any> {
  const user: IUser = yield neuCall(updateUserPromise, updatedUser);
  yield effects.put(actions.auth.loadUser(user));
}

function* logoutWatcher({ web3Manager, jwtStorage }: TGlobalDependencies): Iterator<any> {
  jwtStorage.clear();
  yield web3Manager.unplugPersonalWallet();
}

export const authSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "AUTH_LOGOUT", logoutWatcher);
};
