import { END, eventChannel } from "redux-saga";
import { call, fork, put, race, select, take } from "redux-saga/effects";
import * as Web3 from "web3";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { TxWithMetadata } from "../../../lib/api/users/interfaces";
import { IAppState } from "../../../store";
import { connectWallet } from "../../accessWallet/sagas";
import { actions } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagas";
import { ITxData, TxSenderType } from "./reducer";

export function* withdrawSaga({ logger }: TGlobalDependencies): any {
  try {
    yield neuCall(txSendSaga, "WITHDRAW");
    logger.info("Withdrawing successful");
  } catch (e) {
    logger.warn("Withdrawing cancelled", e);
  }
}

export const txSendingSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeEvery, "WITHDRAW_ETH", withdrawSaga);
};

export function* txSendSaga(_: TGlobalDependencies, type: TxSenderType): any {
  const { result, cancel } = yield race({
    result: neuCall(txSendProcess, type),
    cancel: take("TX_SENDER_HIDE_MODAL"),
  });

  if (cancel) {
    throw new Error("TX_SENDING_CANCELLED");
  }

  // we need to wait for modal to close anyway
  yield take("TX_SENDER_HIDE_MODAL");

  return result;
}

export function* txSendProcess(_: TGlobalDependencies, type: TxSenderType): any {
  yield put(actions.gas.gasApiEnsureLoading());
  yield put(actions.txSender.txSenderShowModal(type));

  yield take("TX_SENDER_ACCEPT");

  yield call(connectWallet, "Send funds!");
  yield put(actions.txSender.txSenderWalletPlugged());

  const txHash = yield neuCall(sendTxSubSaga);

  yield neuCall(watchTxSubSaga, txHash);
}

function* sendTxSubSaga({ web3Manager, apiUserService }: TGlobalDependencies): any {
  const txData: ITxData | undefined = yield select((s: IAppState) => s.txSender.txDetails);
  if (!txData) {
    throw new Error("Tx data is not defined");
  }

  try {
    const txHash: string = yield web3Manager.sendTransaction(txData as any);
    yield put(actions.txSender.txSenderSigned(txHash));
    const txWithMetadata: TxWithMetadata = {
      transaction: {
        from: txData.from!,
        gas: txData.gas!,
        gasPrice: txData.gasPrice!,
        hash: txHash,
        input: txData.data! || "0x0",
        nonce: txData.nonce!,
        to: txData.to!,
        value: txData.value!,
        blockHash: undefined,
        blockNumber: undefined,
        chainId: undefined,
        status: undefined,
        transactionIndex: undefined,
      },
      transactionType: "WITHDRAW", // @todo hardcoded
    };
    yield apiUserService.addPendingTxs(txWithMetadata);

    return txHash;
  } catch (e) {
    yield put(actions.txSender.txSenderError("Tx was rejected"));
    throw e;
  }
}

function* watchTxSubSaga({ logger }: TGlobalDependencies, txHash: string): any {
  const watchTxChannel = yield neuCall(createWatchTxChannel, txHash);

  while (true) {
    const result: TEventEmitterChannelEvents = yield take(watchTxChannel);

    switch (result.type) {
      case "NEW_BLOCK":
        yield put(actions.txSender.txSenderReportBlock(result.blockId));
        break;
      case "TX_MINED":
        return yield put(actions.txSender.txSenderTxMined());
      case "ERROR":
        logger.error("Error while tx watching: ", result.error);
        return yield put(actions.txSender.txSenderError("Error while watching tx."));
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
