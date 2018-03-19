import { effects } from "redux-saga";
import { fork, put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";
import { loadJwt, loadUser } from "../auth/sagas";
import { flows } from "../flows";
import { callAndInject, neuTakeEvery } from "../sagas";
import { loadPreviousWallet } from "../web3/sagas";

function* setup({ web3Manager }: TGlobalDependencies): Iterator<any> {
  try {
    yield web3Manager.initialize();

    yield callAndInject(flows.userAgent.detectUserAgent);
    const jwt = yield callAndInject(loadJwt);
    if (jwt) {
      yield loadUser();
    }
    yield callAndInject(loadPreviousWallet);

    yield put(actions.init.done());
  } catch (e) {
    yield put(actions.init.error(e.message || "Unknown error"));
  }
}

export const initSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", setup);
};
