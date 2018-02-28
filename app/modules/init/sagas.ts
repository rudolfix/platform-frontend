import { effects } from "redux-saga";
import { all, put } from "redux-saga/effects";
import { symbols } from "../../di/symbols";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { injectableFn } from "../../middlewares/redux-injectify";
import { actions } from "../actions";
import { loadJwt, loadUser } from "../auth/sagas";
import { flows } from "../flows";
import { callAndInject, forkAndInject, neuTake } from "../sagas";

export const init = injectableFn(
  function*(web3Manager: Web3Manager): Iterator<any> {
    yield neuTake("INIT_START");

    try {
      yield web3Manager.initialize();

      yield callAndInject(flows.userAgent.detectUserAgent);
      const jwt = yield callAndInject(loadJwt);
      if (jwt) {
        yield loadUser();
      }

      yield put(actions.init.done());
    } catch (e) {
      yield put(actions.init.error(e.message || "Unknown error"));
    }
  },
  [symbols.web3Manager],
);

export const initSagas = function*(): Iterator<effects.Effect> {
  yield all([forkAndInject(init)]);
};
