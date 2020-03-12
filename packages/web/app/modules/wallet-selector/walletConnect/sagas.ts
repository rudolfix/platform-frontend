import { fork, put,neuCall, neuTakeEvery } from "@neufund/sagas";
import { actions } from "../../actions";
import {
  loadSeedFromWalletWatch
} from "../light-wizard/sagas";
import { mapLightWalletErrorToErrorMessage } from "../light-wizard/errors";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { logoutUser } from "../../auth/user/external/sagas";

export function* walletConnectLoginWatch(
  { walletConnectConnector, web3Manager, logger }: TGlobalDependencies
) {
  console.log("walletConnectLoginWatch")
  try {
    const wallet = yield walletConnectConnector.connect();
    yield web3Manager.plugPersonalWallet(wallet);
    yield put(actions.walletSelector.connected());
  } catch (e) {
    logger.error("Light Wallet login error", e);
    yield put(actions.walletSelector.reset());
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* walletConnectLogoutWatch(
  {logger}:TGlobalDependencies
) {
  try {
    yield neuCall(logoutUser)
  } catch (e) {
    logger.error("Light Wallet login error", e);
    yield put(actions.walletSelector.reset());
    yield put(
      actions.walletSelector.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)),
    );
  }
}

export function* walletConnectSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.walletSelector.walletConnectLogin, walletConnectLoginWatch);
  yield fork(neuTakeEvery, actions.walletSelector.walletConnectDisconnected, walletConnectLogoutWatch);
  yield fork(neuTakeEvery, "WEB3_FETCH_SEED", loadSeedFromWalletWatch);
}
