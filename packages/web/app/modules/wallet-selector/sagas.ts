import { END, eventChannel, EventChannel, fork, neuTakeLatest, put ,take} from "@neufund/sagas";

import { WalletConnectErrorMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EWalletConnectEventTypes, TWalletConnectEvents } from "../../lib/web3/wallet-connect/WalletConnectConnector";
import { WalletConnectSessionRejectedError } from "../../lib/web3/wallet-connect/WalletConnectWallet";
import { actions } from "../actions";
import { logoutUser } from "../auth/user/external/sagas";
import { handleSignInUser } from "../auth/user/sagas";
import { neuCall, neuTakeEvery, neuTakeLatestUntil } from "../sagasUtils";
import { loadPreviousWallet } from "../web3/sagas";
import { mapLightWalletErrorToErrorMessage } from "./light-wizard/errors";

export function* walletSelectorConnect(): Generator<any, any, any> {
  yield put(actions.walletSelector.messageSigning());
  console.log("walletSelectorConnect");
  yield neuCall(handleSignInUser);
}

export function* walletSelectorReset(): Generator<any, any, any> {
  yield neuCall(loadPreviousWallet);
}

function* startWcActions(channel: EventChannel<TWalletConnectEvents>) {
  while (true) {
    const event: TWalletConnectEvents | END = yield take(channel);
    switch (event.type) {
      case EWalletConnectEventTypes.SESSION_REQUEST:
        yield put(actions.walletSelector.walletConnectSessionRequest(event.payload.uri));
        break;
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
        yield put(actions.walletSelector.walletConnectError(
          createMessage(WalletConnectErrorMessage.WC_GENERIC_ERROR,
            event.payload.error
          )
        ));
        break;
    }
  }
}

export function* walletConnectInit(
  { walletConnectConnector }: TGlobalDependencies
): Generator<any, void, any> {
  yield console.log("walletConnectInit started");

  const channel = eventChannel<TWalletConnectEvents>(emit => {
    walletConnectConnector.on(EWalletConnectEventTypes.SESSION_REQUEST, uri =>
      emit({ type: EWalletConnectEventTypes.SESSION_REQUEST, payload: {uri} }));
    walletConnectConnector.on(EWalletConnectEventTypes.CONNECT, () =>
      emit({ type: EWalletConnectEventTypes.CONNECT }));
    walletConnectConnector.on(EWalletConnectEventTypes.DISCONNECT, () =>
      emit({ type: EWalletConnectEventTypes.DISCONNECT }));
    walletConnectConnector.on(EWalletConnectEventTypes.REJECT, () =>
      emit({ type: EWalletConnectEventTypes.REJECT }));
    walletConnectConnector.on(EWalletConnectEventTypes.ERROR, error =>
      emit({ type: EWalletConnectEventTypes.ERROR, payload: { error } }));

    return () => {
      walletConnectConnector.removeAllListeners()
    }
  });
  yield fork(startWcActions, channel);
  yield* neuCall(walletConnectStart);
}

//todo move to utils
export const mapWalletConnectErrorsToMessages = (error: Error) => {
  if (error instanceof WalletConnectSessionRejectedError) {
    return createMessage(WalletConnectErrorMessage.WC_SESSION_REJECTED_ERROR)
  } else {
    return createMessage(WalletConnectErrorMessage.WC_GENERIC_ERROR)
  }
};

export function* walletConnectStart(
  { web3Manager, walletConnectConnector }: TGlobalDependencies
): Generator<any, void, any> {
  try {
    const wc = yield walletConnectConnector.connect();
    yield web3Manager.plugPersonalWallet(wc);
    yield* neuCall(walletSelectorConnect)
  } catch (e) {
    const message = mapWalletConnectErrorsToMessages(e);
    yield put(actions.walletSelector.walletConnectError(message));
    console.log("walletConnectStart error:", e);
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
    console.log("walletConnectStop error:", e)
  }
}

export function* walletConnectLogout(
  { logger }: TGlobalDependencies
): Generator<any, void, any> {
  console.log("walletConnectLogout");
  try {
    yield neuCall(logoutUser)
  } catch (e) {
    logger.error("wallet connect logout error", e);
    console.log("wallet connect logout error");
    yield put(actions.walletSelector.reset());
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
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
  yield fork(neuTakeLatest, actions.walletSelector.walletConnectInit, walletConnectInit); //todo stop on route change
  yield fork(neuTakeEvery, actions.walletSelector.walletConnectStart, walletConnectStart);
  yield fork(neuTakeEvery, actions.walletSelector.walletConnectStop, walletConnectStop);
  yield fork(neuTakeEvery, actions.walletSelector.walletConnectDisconnected, walletConnectLogout);
}
