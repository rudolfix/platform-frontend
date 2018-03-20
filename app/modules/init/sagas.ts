import { effects } from "redux-saga";
import { fork, put, call } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";
import { loadJwt, loadUser } from "../auth/sagas";

import { neuCall, neuTakeEvery } from "../sagas";
import { loadPreviousWallet } from "../web3/sagas";
import { detectUserAgent } from "../userAgent/sagas";
import { initializeContracts } from "../contracts/sagas";

function* setup({ web3Manager }: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(detectUserAgent);
    yield web3Manager.initialize();

    const jwt = yield neuCall(loadJwt);
    if (jwt) {
      yield loadUser();
    }
    yield neuCall(loadPreviousWallet);
    yield neuCall(initializeContracts);

    yield put(actions.init.done());
  } catch (e) {
    yield put(actions.init.error(e.message || "Unknown error"));
  }
}

export const initSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", setup);
};
