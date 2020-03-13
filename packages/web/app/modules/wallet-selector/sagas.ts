import { END, eventChannel, fork, put, take ,neuTakeLatest} from "@neufund/sagas";

import { TGlobalDependencies } from "../../di/setupBindings";
import { EWalletConnectEventTypes, TWalletConnectEvents } from "../../lib/web3/wallet-connect/WalletConnectConnector";
import { actions } from "../actions";
import { handleSignInUser } from "../auth/user/sagas";
import { neuCall, neuTakeEvery, neuTakeLatestUntil } from "../sagasUtils";
import { loadPreviousWallet } from "../web3/sagas";
import { logoutUser } from "../auth/user/external/sagas";
import { mapLightWalletErrorToErrorMessage } from "./light-wizard/errors";
import { WalletConnectSessionRejectedError } from "../../lib/web3/wallet-connect/WalletConnectWallet";
import { createMessage } from "../../components/translatedMessages/utils";
import { WalletConnectErrorMessage } from "../../components/translatedMessages/messages";

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

    return () => {
      walletConnectConnector.removeAllListeners()
    }
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
        yield put(actions.walletSelector.walletConnectError(
          createMessage(WalletConnectErrorMessage.WC_GENERIC_ERROR,
            event.payload.error
          )
        ));
        break;
    }
  }
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
) {
  console.log("walletConnectLogout")
  try {
    yield neuCall(logoutUser)
  } catch (e) {
    logger.error("wallet connect logout error", e);
    console.log("wallet connect logout error")
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
