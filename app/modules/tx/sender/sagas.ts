import { END, eventChannel } from "redux-saga";
import { call, put, race, select, take } from "redux-saga/effects";
import * as Web3 from "web3";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { IAppState } from "../../../store";
import { EthereumAddress } from "../../../types";
import { connectWallet } from "../../accessWallet/sagas";
import { actions } from "../../actions";
import { neuCall } from "../../sagas";
import { selectEthereumAddress } from "../../web3/selectors";
import { TxSenderType } from "./reducer";

export function* txSendSaga(_: TGlobalDependencies, type: TxSenderType): any {
  const { result, cancel } = yield race({
    result: neuCall(txSendProcess, type),
    cancel: take("TX_SENDER_HIDE_MODAL"),
  });

  if (cancel) {
    throw new Error("TX_SENDING_CANCELLED");
  }

  // we need to wait for modal to close anyway
  yield take("HIDE_ACCESS_WALLET_MODAL");

  return result;
}

export function* txSendProcess(
  { web3Manager, logger }: TGlobalDependencies,
  type: TxSenderType,
): any {
  yield put(actions.txSender.txSenderShowModal(type));

  yield take("TX_SENDER_ACCEPT");

  yield call(connectWallet, "Send funds!");
  yield put(actions.txSender.txSenderWalletPlugged());

  const txData: Web3.TxData | undefined = yield select((s: IAppState) => s.txSender.txDetails);
  if (!txData) {
    throw new Error("Tx data is not defined");
  }
  const address: EthereumAddress = yield select((s: IAppState) => selectEthereumAddress(s.web3));
  const finalData = { ...txData, from: address };

  let txHash: string;
  try {
    txHash = yield web3Manager.sendTransaction(finalData);
  } catch (e) {
    yield put(actions.txSender.txSenderError("Tx was rejected"));
    throw e;
  }

  yield put(actions.txSender.txSenderSigned());

  const watchTxChannel = yield neuCall(createWatchTxChannel, txHash);

  let done = false;
  while (!done) {
    const result: TEventEmitterChannelEvents = yield take(watchTxChannel);

    switch (result.type) {
      case "NEW_BLOCK":
        yield put(actions.txSender.txSenderReportBlock(result.blockId));
        break;
      case "TX_MINED":
        yield put(actions.txSender.txSenderTxMined());
        done = true;
        break;
      case "ERROR":
        logger.error(result.error);
        done = true;
        break;
    }
  }
}

type TEventEmitterChannelEvents =
  | {
      type: "NEW_BLOCK";
      blockId: number;
    }
  | {
      type: "TX_MINED";
      tx: Web3.Transaction;
    }
  | {
      type: "ERROR";
      error: any;
    };

const createWatchTxChannel = ({ web3Manager }: TGlobalDependencies, txHash: string) =>
  eventChannel<TEventEmitterChannelEvents>(emitter => {
    web3Manager.internalWeb3Adapter
      .waitForTx({
        txHash,
        onNewBlock: async blockId => {
          emitter({ type: "NEW_BLOCK", blockId });
        },
      })
      .then(tx => emitter({ type: "TX_MINED", tx }))
      .catch(error => emitter({ type: "ERROR", error }))
      .then(() => emitter(END));

    return () => {
      // @todo missing unsubscribe
    };
  });
