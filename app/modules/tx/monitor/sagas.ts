import { delay } from "redux-saga";
import { put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { TxWithMetadata } from "../../../lib/api/users/interfaces";
import { actions } from "../../actions";
import { neuCall } from "../../sagas";
import { neuTakeUntil } from "../../sagasUtils";

const TX_MONITOR_DELAY = 60000;

export function* updateTxs({ apiUserService }: TGlobalDependencies): any {
  const txs: Array<TxWithMetadata> = yield apiUserService.pendingTxs();

  yield put(actions.txMonitor.loadTxs(txs));
}

function* txMonitor({ logger }: TGlobalDependencies): any {
  while (true) {
    logger.info("Querying for pending txs...");

    yield neuCall(updateTxs);

    yield delay(TX_MONITOR_DELAY);
  }
}

export function* txMonitorSagas(): any {
  yield neuTakeUntil("AUTH_LOAD_USER", "AUTH_LOGOUT", txMonitor);
}
