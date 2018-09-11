import { delay } from "redux-saga";
import { put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { TxWithMetadata } from "../../../lib/api/users/interfaces";
import { actions } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagas";
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
      if (transactionReceipt) return tx;
      else apiUserService.deletePendingTx(tx.transaction.hash);
    }),
  );
  return nodePendingTx.filter(tx => (tx ? tx : undefined));
}

export function* updateTxs(): any {
  try {
    const apiPendingTx = yield neuCall(getPendingTransactionsPromise);
    const txs = yield neuCall(cleanPendingTransactionsPromise, apiPendingTx);
    yield put(actions.txMonitor.loadTxs(txs));
  } catch (e) {
    debugger;
  }
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