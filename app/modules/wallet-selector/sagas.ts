import { effects } from "redux-saga";
import { fork } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions, TAction } from "../actions";
import { loadUser } from "../auth/sagas";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectEthereumAddressWithChecksum } from "../web3/reducer";

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
}: TGlobalDependencies): Promise<string> {
  const address = selectEthereumAddressWithChecksum(getState().web3State);

  const salt = cryptoRandomString(64);

  /* tslint:disable: no-useless-cast */
  const signerType = web3Manager.personalWallet!.signerType;
  /* tslint:enable: no-useless-cast */

  logger.info("Obtaining auth challenge from api");
  const { body: { challenge } } = await signatureAuthApi.challenge(address, salt, signerType);

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

export const walletSelectorSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "WALLET_SELECTOR_CONNECTED", signInUser);
};

function* obtainJWT(): Iterator<any> {
  yield effects.put(actions.wallet.messageSigning());

  const jwt: string = yield neuCall(obtainJwtPromise);
  yield effects.put(actions.auth.loadJWT(jwt));
  yield neuCall(saveJwtToStorage, jwt);

  return jwt;
}
