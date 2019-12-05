import { fork } from "redux-saga/effects";

import { txTransferUserFlowSagasWatcher } from "./transfer/sagas";
import { txTokenTransferFlowSagasWatcher } from "./transfer/token-transfer/sagas";
import { txWithdrawUserFlowSagasWatcher } from "./transfer/withdraw/sagas";
import { txUserFlowInvestmentSagas } from "./investment/sagas";

export const txUserFlowSagasWatcher = function*(): Iterator<any> {
  yield fork(txWithdrawUserFlowSagasWatcher);
  yield fork(txTransferUserFlowSagasWatcher);
  yield fork(txTokenTransferFlowSagasWatcher);
  yield fork(txUserFlowInvestmentSagas)
};


