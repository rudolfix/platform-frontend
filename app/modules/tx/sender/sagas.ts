import { fork, put, select, call } from "redux-saga/effects";
import { neuTakeEvery } from "../../sagas";
import { actions } from "../../actions";
import { TxSenderType } from "./reducer";
import { accessWalletAndRunEffect } from "../../accessWallet/sagas";

export function* txSendSaga(type: TxSenderType): any {
  yield put(actions.txSender.txSenderShowModal(type));

  // yield call(accessWalletAndRunEffect, sendEffect, "Send funds!");

  // yield select(actions.txSenderActions.)
}
