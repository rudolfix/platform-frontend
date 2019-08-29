import { fork } from "redux-saga/effects";

import { actions } from "../actions";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { loadPreviousWallet } from "../web3/sagas";

export function* walletSelectorReset(): Iterator<any> {
  yield neuCall(loadPreviousWallet);
}

export function* walletSelectorSagas(): Iterator<any> {
  yield fork(neuTakeEvery, actions.walletSelector.reset, walletSelectorReset);
}
