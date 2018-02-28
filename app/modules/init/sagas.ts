import { neuTake, callAndInject } from "../sagas";
import { symbols } from "../../di/symbols";
import { AppDispatch } from "../../store";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { injectableFn } from "../../middlewares/redux-injectify";
import { flows } from "../flows";
import { loadJwt, loadUser } from "../auth/sagas";
import { effects } from "redux-saga";
import { all, fork } from "redux-saga/effects";

export const init = injectableFn(
  function*(dispatch: AppDispatch, web3Manager: Web3Manager): Iterator<any> {
    yield neuTake("INIT_START");

    yield dispatch(flows.userAgent.detectUserAgent);
    yield web3Manager.initialize();
    yield callAndInject(loadJwt);
    yield loadUser();

    console.log("AUTH DONE");
  },
  [symbols.appDispatch, symbols.web3Manager],
);

export const initSagas = function*(): Iterator<effects.Effect> {
  yield all([forkAndInject(init)]);
};
