import { fork, put, select, call, take } from "redux-saga/effects";

import { neuTakeEvery, neuCall } from "../../sagas";
import { actions } from "../../actions";
import { TxSenderType } from "./reducer";
import { accessWalletAndRunEffect, accessWallet } from "../../accessWallet/sagas";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { IAppState } from "../../../store";
import { TxData } from "web3";

export function* txSendSaga(type: TxSenderType): any {
  yield put(actions.txSender.txSenderShowModal(type));

  yield take("TX_SENDER_CONFIRM");

  yield call(accessWallet, "Send funds!");

  yield neuCall(sendTx);

  // 2. summary
  // 1. make sure that wallet is unlocked
  // 3. pending
  // 4. status

  // yield select(actions.txSenderActions.)
}

function* sendTx({ web3Manager, logger }: TGlobalDependencies): any {
  logger.debug("Sending transaction.");
  const txData: TxData | undefined = yield select((s: IAppState) => s.txSender.txDetails);
  if (!txData) {
    throw new Error("Tx data is not defined");
  }

  const txHash: string = yield web3Manager.sendTransaction(txData);

  logger.debug({ txHash });
}
