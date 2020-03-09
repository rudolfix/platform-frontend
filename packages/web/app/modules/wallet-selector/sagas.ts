import { fork, put , take} from "@neufund/sagas";

import { actions } from "../actions";
import { handleSignInUser } from "../auth/user/sagas";
import { neuCall, neuTakeEvery, neuTakeLatestUntil } from "../sagasUtils";
import { loadPreviousWallet } from "../web3/sagas";
import { TGlobalDependencies } from "../../di/setupBindings";

export function* walletSelectorConnect(): Generator<any, any, any> {
  yield put(actions.walletSelector.messageSigning());

  yield neuCall(handleSignInUser);
}

export function* walletSelectorReset(): Generator<any, any, any> {
  yield neuCall(loadPreviousWallet);
}

export function* walletConnectInit(
  _:TGlobalDependencies
):Generator<any,void,any>{
  yield console.log("walletConnectInit started");

  while (true){
    console.log('loop');
    yield take(actions.walletSelector.connectToBridge);
    yield neuCall(walletConnectStart);
  }
}

export function* walletConnectStart(
  {web3Manager,walletConnectConnector }:TGlobalDependencies
) {
  try {
    const wc = yield walletConnectConnector.connect();

    console.log("wc", wc)
    yield web3Manager.plugPersonalWallet(wc)
  }catch(e){
    console.log(e)
  }
}

export function* walletSelectorSagas(): Generator<any, any, any> {
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.connected,
    actions.walletSelector.reset,
    walletSelectorConnect,
  );
  yield fork(neuTakeEvery, actions.walletSelector.reset, walletSelectorReset);
  yield fork(neuTakeEvery, actions.walletSelector.walletConnectInit, walletConnectInit);
}
