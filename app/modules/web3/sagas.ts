import { delay, Task } from "redux-saga";
import { all, call, cancel, fork, put, take } from "redux-saga/effects";
import { LIGHT_WALLET_PASSWORD_CACHE_TIME } from "../../config/constants";
import { symbols } from "../../di/symbols";
import { ILogger } from "../../lib/dependencies/Logger";
import { LightWallet, LightWalletWrongPassword } from "../../lib/web3/LightWallet";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { injectableFn } from "../../middlewares/redux-injectify";
import { actions } from "../actions";
import { forkAndInject } from "../sagas";

export const clearUnlockedWalletPassword = injectableFn(
  function*(web3Manager: Web3Manager, logger: ILogger): Iterator<any> {
    logger.info(`Resetting light wallet password in ${LIGHT_WALLET_PASSWORD_CACHE_TIME} ms`);
    yield call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME);

    if (web3Manager.personalWallet) {
      logger.info("Resetting light wallet password now");
      yield put(actions.web3.walletLocked());
      (web3Manager.personalWallet as LightWallet).password = undefined;
    }
  },
  [symbols.web3Manager, symbols.logger],
);

export function* clearUnlockedWalletPasswordWatcher(): Iterator<any> {
  while (true) {
    yield take(["NEW_PERSONAL_WALLET_PLUGGED", "WEB3_WALLET_UNLOCKED"]);
    const clearPasswordSaga: Task = yield* forkAndInject(clearUnlockedWalletPassword);

    yield take(["PERSONAL_WALLET_DISCONNECTED", "WEB3_WALLET_LOCKED"]);
    yield cancel(clearPasswordSaga);
  }
}

export const unlockWallet = injectableFn(
  function*(web3Manager: Web3Manager, password: string): Iterator<any> {
    const lightWallet = web3Manager.personalWallet as LightWallet;

    const isPasswordCorrect = yield lightWallet.testPassword(password);
    if (!isPasswordCorrect) {
      throw new LightWalletWrongPassword();
    }

    lightWallet.password = password;
    yield put(actions.web3.walletUnlocked());
  },
  [symbols.web3Manager],
);

export const web3Sagas = function*(): Iterator<any> {
  yield all([fork(clearUnlockedWalletPasswordWatcher)]);
};
