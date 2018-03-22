import { effects } from "redux-saga";
import { Effect, fork } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IUser } from "../../lib/api/users/interfaces";
import { UserNotExisting } from "../../lib/api/users/UsersApi";
import { actions } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectEthereumAddressWithChecksum } from "../web3/reducer";
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

function* signInUser(): Iterator<any> {
  try {
    yield obtainJWT();
    yield effects.spawn(loadUser);

    yield effects.put(actions.routing.goToDashboard());
  } catch (e) {
    yield effects.put(actions.wallet.messageSigningError("Error while signing a message!"));
  }
}

export async function obtainJwtPromise({
  getState,
  web3Manager,
  signatureAuthApi,
  cryptoRandomString,
  logger,
}: TGlobalDependencies, permissions: Array<string> = []): Promise<string> {
  const address = selectEthereumAddressWithChecksum(getState().web3State);

  const salt = cryptoRandomString(64);

  /* tslint:disable: no-useless-cast */
  const signerType = web3Manager.personalWallet!.signerType;
  /* tslint:enable: no-useless-cast */

  logger.info("Obtaining auth challenge from api");
  const { body: { challenge } } = await signatureAuthApi.challenge(address, salt, signerType, permissions);

  logger.info("Signing challenge");
  /* tslint:disable: no-useless-cast */
  const signedChallenge = await web3Manager.personalWallet!.signMessage(challenge);
  /* tslint:enable: no-useless-cast */

  logger.info("Sending signed challenge back to api");
  const { body: { jwt } } = await signatureAuthApi.createJwt(
    challenge,
    signedChallenge,
    signerType,
  );

  return jwt;
}

function* saveJwtToStorage({ jwtStorage }: TGlobalDependencies, jwt: string): Iterator<any> {
  jwtStorage.set(jwt);
}

function* obtainJWT(): Iterator<any> {
  yield effects.put(actions.wallet.messageSigning());

  const jwt: string = yield neuCall(obtainJwtPromise);
  yield effects.put(actions.auth.loadJWT(jwt));
  yield neuCall(saveJwtToStorage, jwt);

  return jwt;
}

export const authSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "AUTH_LOGOUT", logoutWatcher);
  yield fork(neuTakeEvery, "WALLET_SELECTOR_CONNECTED", signInUser);
};
