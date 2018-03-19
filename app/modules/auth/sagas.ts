import { effects } from "redux-saga";
import { fork } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { symbols } from "../../di/symbols";
import { IUser } from "../../lib/api/users/interfaces";
import { UserNotExisting, UsersApi } from "../../lib/api/users/UsersApi";
import { ObjectStorage } from "../../lib/persistence/ObjectStorage";
import { TWalletMetadata } from "../../lib/persistence/WalletMetadataObjectStorage";
import { injectableFn } from "../../middlewares/redux-injectify";
import { actions } from "../actions";
import { callAndInject, neuTakeEvery } from "../sagas";
import { WalletType } from "../web3/types";

export const loadJwt = injectableFn(
  function*(storage: ObjectStorage<string>): Iterator<any> {
    const jwt = storage.get();
    if (jwt) {
      yield effects.put(actions.auth.loadJWT(jwt));
      return jwt;
    }
  },
  [symbols.jwtStorage],
);

export const loadUserPromise = injectableFn(
  async function(
    usersApi: UsersApi,
    walletMetadataStorage: ObjectStorage<TWalletMetadata>,
  ): Promise<IUser> {
    try {
      return await usersApi.me();
    } catch (e) {
      if (!(e instanceof UserNotExisting)) {
        throw e;
      }
    }

    // for light wallet we need to send slightly different request
    const walletMetadata = walletMetadataStorage.get();
    if (walletMetadata && walletMetadata.walletType === WalletType.LIGHT) {
      return usersApi.createAccount({
        unverifiedEmail: walletMetadata.email,
        salt: walletMetadata.salt,
        backupCodesVerified: false,
      });
    } else {
      return usersApi.createAccount();
    }
  },
  [symbols.usersApi, symbols.walletMetadataStorage],
);

export const updateUserPromise = injectableFn(
  async function(usersApi: UsersApi, user: IUser): Promise<IUser> {
    await usersApi.me();
    return usersApi.updateUser(user);
  },
  [symbols.usersApi],
);

export function* loadUser(): Iterator<any> {
  const user: IUser = yield callAndInject(loadUserPromise);
  yield effects.put(actions.auth.loadUser(user));
}

export function* updateUser(updatedUser: IUser): Iterator<any> {
  const user: IUser = yield callAndInject(updateUserPromise, updatedUser);
  yield effects.put(actions.auth.loadUser(user));
}

function* logoutWatcher({ web3Manager, jwtStorage }: TGlobalDependencies): Iterator<any> {
  jwtStorage.clear();
  yield web3Manager.unplugPersonalWallet();
}

export const authSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "AUTH_LOGOUT", logoutWatcher);
};
