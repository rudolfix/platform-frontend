import { put } from "redux-saga/effects";
import { delay } from "../../../../node_modules/redux-saga";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { TxWithMetadata } from "../../../lib/api/users/interfaces";
import { actions } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagas";
import { neuTakeUntil } from "../../sagasUtils";

const TX_MONITOR_DELAY = 60000;

function* txMonitor({ apiUserService, logger }: TGlobalDependencies): any {
  while (true) {
    logger.info("Querying for pending txs...");

    const txs: Array<TxWithMetadata> = yield apiUserService.pendingTxs();

    yield put(actions.txMonitor.loadTxs(txs));

    yield delay(TX_MONITOR_DELAY);
  }
}

export function* txMonitorSagas(): any {
  yield neuTakeUntil("AUTH_LOAD_USER", "AUTH_LOGOUT", txMonitor);
}
