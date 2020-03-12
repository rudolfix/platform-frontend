import { END, eventChannel, fork, put, take } from "@neufund/sagas";

import { TGlobalDependencies } from "../../di/setupBindings";
import { EWalletConnectEventTypes, TWalletConnectEvents } from "../../lib/web3/wallet-connect/WalletConnectConnector";
import { actions } from "../actions";
import { handleSignInUser } from "../auth/user/sagas";
import { neuCall, neuTakeEvery, neuTakeLatestUntil } from "../sagasUtils";
import { loadPreviousWallet } from "../web3/sagas";

export function* walletSelectorConnect(): Generator<any, any, any> {
  yield put(actions.walletSelector.messageSigning());
  console.log("walletSelectorConnect");
  yield neuCall(handleSignInUser);
}

export function* walletSelectorReset(): Generator<any, any, any> {
  yield neuCall(loadPreviousWallet);
}


export function* walletConnectInit(
  { walletConnectConnector }: TGlobalDependencies
): Generator<any, void, any> {
  yield console.log("walletConnectInit started");

  const channel = eventChannel<TWalletConnectEvents>(emit => {
    walletConnectConnector.on(EWalletConnectEventTypes.CONNECT, () =>
      emit({ type: EWalletConnectEventTypes.CONNECT }));
    walletConnectConnector.on(EWalletConnectEventTypes.DISCONNECT, () =>
      emit({ type: EWalletConnectEventTypes.DISCONNECT }));
    walletConnectConnector.on(EWalletConnectEventTypes.REJECT, () =>
      emit({ type: EWalletConnectEventTypes.REJECT }));
    walletConnectConnector.on(EWalletConnectEventTypes.ERROR, error =>
      emit({ type: EWalletConnectEventTypes.ERROR, payload: { error } }));

    return () => {walletConnectConnector.removeAllListeners()}
  });

  yield put(actions.walletSelector.walletConnectStart());

  while (true) {
    const event: TWalletConnectEvents | END = yield take(channel);
    switch (event.type) {
      case EWalletConnectEventTypes.CONNECT:
        yield put(actions.walletSelector.walletConnectReady());
        break;
      case EWalletConnectEventTypes.REJECT:
        yield put(actions.walletSelector.walletConnectRejected());
        break;
      case EWalletConnectEventTypes.DISCONNECT:
        yield put(actions.walletSelector.walletConnectDisconnected());
        break;
      case EWalletConnectEventTypes.ERROR:
        yield put(actions.walletSelector.walletConnectError(event.payload.error));
        break;
    }
  }
}

export function* walletConnectStart(
  { web3Manager, walletConnectConnector }: TGlobalDependencies
): Generator<any, boolean, any> {
  try {
    const wc = yield walletConnectConnector.connect();
    yield web3Manager.plugPersonalWallet(wc);
    yield put(actions.walletSelector.walletConnectLogin())
    return true
  } catch (e) {
    console.log("walletConnectStart error:", e);
    return false
  }
}

export function* walletConnectStop(
  { walletConnectConnector }: TGlobalDependencies
): Generator<any, void, any> {
  console.log("disconnecting...");
  try {
    const result = yield walletConnectConnector.disconnect();
    console.log(result)
  } catch (e) {
    console.log("walletConnectStop error:",e)
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
  yield fork(neuTakeEvery, actions.walletSelector.walletConnectStart, walletConnectStart);
  yield fork(neuTakeEvery, actions.walletSelector.walletConnectStop, walletConnectStop);
}
