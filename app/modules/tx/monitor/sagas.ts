import { delay } from "redux-saga";
import { put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { TxWithMetadata } from "../../../lib/api/users/interfaces";
import { actions } from "../../actions";
import { neuCall } from "../../sagas";
import { neuTakeUntil } from "../../sagasUtils";

const TX_MONITOR_DELAY = 60000;

async function getPendingTransactionsPromise({
  apiUserService,
}: TGlobalDependencies): Promise<Array<TxWithMetadata>> {
  return apiUserService.pendingTxs();
}

async function cleanPendingTransactionsPromise(
  { web3Manager, apiUserService }: TGlobalDependencies,
  apiPendingTx: Array<TxWithMetadata>,
): Promise<any> {
  const nodePendingTx = await Promise.all(
    apiPendingTx.map(async tx => {
      const transactionReceipt = await web3Manager.internalWeb3Adapter.getTransactionReceipt(
        tx.transaction.hash,
      );
      // transactionReceipt should be null if transaction is not mined
      if (transactionReceipt && transactionReceipt.blockNumber)
        await apiUserService.deletePendingTx(tx.transaction.hash);
      else return tx;
    }),
  );
  return nodePendingTx.filter(tx => tx);
}

export function* updateTxs(): any {
  const apiPendingTx = yield neuCall(getPendingTransactionsPromise);
  const txs = yield neuCall(cleanPendingTransactionsPromise, apiPendingTx);
  yield put(actions.txMonitor.loadTxs(txs));
}

function* txMonitor({ logger, notificationCenter }: TGlobalDependencies): any {
  while (true) {
    logger.info("Querying for pending txs...");
    try {
      yield neuCall(updateTxs);
    } catch (e) {
      notificationCenter.error("Error while trying to get pending transactions");
      logger.error("Error getting pending txs", e);
    }

    yield delay(TX_MONITOR_DELAY);
  }
}

export function* txMonitorSagas(): any {
  yield neuTakeUntil("AUTH_LOAD_USER", "AUTH_LOGOUT", txMonitor);
}
