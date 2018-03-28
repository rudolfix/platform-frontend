import { effects } from "redux-saga";
import { fork, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { isJwtExpiringLateEnough } from "../../utils/JWTUtils";
import { actions } from "../actions";
import { loadJwt, loadUser } from "../auth/sagas";
import { initializeContracts } from "../contracts/sagas";
import { neuCall, neuTakeEvery } from "../sagas";
import { detectUserAgent } from "../userAgent/sagas";
import { loadPreviousWallet } from "../web3/sagas";

function* setup({ web3Manager, logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(detectUserAgent);
    yield web3Manager.initialize();

    const jwt = yield neuCall(loadJwt);

    if (jwt) {
      if (isJwtExpiringLateEnough(jwt)) {
        yield loadUser();
      } else {
        yield put(actions.auth.logout());
        yield put(actions.routing.goToLogin());
        logger.error("JTW expiring to soon.");
      }
    }

    yield neuCall(loadPreviousWallet);
    yield neuCall(initializeContracts);

    yield put(actions.init.done());
  } catch (e) {
    yield put(actions.init.error(e.message || "Unknown error"));
    logger.error("Error: ", e);
  }
}

export const initSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", setup);
};
