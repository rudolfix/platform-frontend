import { fork, put } from "@neufund/sagas";

import { actions } from "../actions";
import { handleSignInUser } from "../auth/user/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { loadPreviousWallet } from "../web3/sagas";

export function* walletSelectorConnect(): Generator<any, any, any> {
  yield put(actions.walletSelector.messageSigning());

  yield neuCall(handleSignInUser);
}

export function* walletSelectorReset(): Generator<any, any, any> {
  yield neuCall(loadPreviousWallet);
}

export function* walletSelectorSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.walletSelector.reset, walletSelectorReset);
}
