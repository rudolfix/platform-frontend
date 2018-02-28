import { effects } from "redux-saga";
import { symbols } from "../../di/symbols";
import { IUser } from "../../lib/api/users/interfaces";
import { ObjectStorage } from "../../lib/persistence/ObjectStorage";
import { TWalletMetadata } from "../../lib/persistence/WalletMetadataObjectStorage";
import { actions } from "../actions";
import { getDependency, neuTake, callAndInject } from "../sagas";
import { WalletType } from "../web3/types";
import { UsersApi, UserNotExisting } from "../../lib/api/users/UsersApi";
import { injectableFn } from "../../middlewares/redux-injectify";
import { select } from "redux-saga/effects";

export const loadJwt = injectableFn(
  function* (storage: ObjectStorage<string>): Iterator<any> {
    const jwt = storage.get();
    if (jwt) {
      yield effects.put(actions.auth.loadJWT(jwt));
      return jwt;
    }
  },
  [symbols.jwtStorage]
)

export function* loadUser(): Iterator<any> {
  const user: IUser = yield callAndInject(loadUserPromise);
  yield effects.put(actions.auth.loadUser(user));
}

export const loadUserPromise = injectableFn(
  async function(usersApi: UsersApi, walletMetadataStorage: ObjectStorage<TWalletMetadata>) {
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
        backupCodesVerified: true,
      });
    } else {
      return usersApi.createAccount();
    }
  },
  [symbols.usersApi, symbols.walletMetadataStorage],
);
