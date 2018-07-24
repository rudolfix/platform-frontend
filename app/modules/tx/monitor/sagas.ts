import { fork } from "redux-saga/effects";
import { neuTakeEvery } from "../../sagas";

function* txMonitor(): any {
  // 1. ask api
  // 2. query tx statuses with blockchain
  // 3. put them into state
  // 4. sleep
  // 5. repeat
}

export function* txMonitorSagas(): any {
  yield fork(neuTakeEvery, "TX_MONITOR_START", txMonitor);
}
