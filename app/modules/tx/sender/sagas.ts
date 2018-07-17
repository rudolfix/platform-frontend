import { fork, put, select, call, take } from "redux-saga/effects";

import { neuTakeEvery, neuCall } from "../../sagas";
import { actions } from "../../actions";
import { TxSenderType } from "./reducer";
import { accessWalletAndRunEffect, accessWallet } from "../../accessWallet/sagas";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { IAppState } from "../../../store";
import { TxData } from "web3";
import { selectEthereumAddress } from "../../web3/selectors";
import { EthereumAddress } from "../../../types";

export function* txSendSaga(type: TxSenderType): any {
  yield put(actions.txSender.txSenderShowModal(type));

  yield take("TX_SENDER_CONFIRM");

  yield call(accessWallet, "Send funds!");

  const txReceipt: string = yield neuCall(sendTx);
}

function* sendTx({ web3Manager, logger }: TGlobalDependencies): any {
  const txData: TxData | undefined = yield select((s: IAppState) => s.txSender.txDetails);
  if (!txData) {
    throw new Error("Tx data is not defined");
  }
  const address: EthereumAddress = yield select((s: IAppState) => selectEthereumAddress(s.web3));
  const finalData = { ...txData, from: address };

  const txHash: string = yield web3Manager.sendTransaction(finalData);
}
