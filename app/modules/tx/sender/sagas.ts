import { END, eventChannel } from "redux-saga";
import { call, fork, put, race, select, take } from "redux-saga/effects";
import * as Web3 from "web3";

import { addHexPrefix } from "ethereumjs-util";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { TxWithMetadata } from "../../../lib/api/users/interfaces";
import { IAppState } from "../../../store";
import { connectWallet, signMessage } from "../../accessWallet/sagas";
import { actions, TAction } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagas";
import { updateTxs } from "../monitor/sagas";
import { ITxData } from "./../../../lib/web3/Web3Manager";
import { TxSenderType } from "./reducer";

export function* withdrawSaga({ logger }: TGlobalDependencies): any {
  try {
    yield neuCall(txSendSaga, "WITHDRAW");
    logger.info("Withdrawing successful");
  } catch (e) {
    logger.warn("Withdrawing cancelled", e);
  }
}

export function* investSaga({ logger }: TGlobalDependencies): any {
  try {
    yield neuCall(txSendSaga, "INVEST");
    logger.info("Investment successful");
  } catch (e) {
    logger.warn("Investment cancelled", e);
  }
}

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

  yield neuCall(ensureNoPendingTx, type);

  yield take("TX_SENDER_ACCEPT");

  yield call(connectWallet, "Send funds!");
  yield put(actions.txSender.txSenderWalletPlugged());
  const txHash = yield neuCall(sendTxSubSaga);

  yield neuCall(watchTxSubSaga, txHash);
}

function* ensureNoPendingTx(
  { apiUserService, web3Manager, logger }: TGlobalDependencies,
  type: TxSenderType,
): any {
  yield updateTxs();
  let txs: Array<TxWithMetadata> = yield select((s: IAppState) => s.txMonitor.txs);

  if (txs.length >= 1) {
    yield put(actions.txSender.txSenderWatchPendingTxs());

    while (txs.length > 0) {
      const {
        transaction: { hash: txHash },
      } = txs[0];

      logger.info("Watching tx: ", txHash);
      yield web3Manager.internalWeb3Adapter.waitForTx({ txHash });

      yield apiUserService.deletePendingTx(txHash);

      yield neuCall(updateTxs);
      txs = yield select((s: IAppState) => s.txMonitor.txs);
    }
  }

  yield put(actions.txSender.txSenderWatchPendingTxsDone(type));
}

function* sendTxSubSaga({ web3Manager, apiUserService }: TGlobalDependencies): any {
  const txData: ITxData | undefined = yield select((s: IAppState) => s.txSender.txDetails);
  const type: TxSenderType = yield select((s: IAppState) => s.txSender.type);

  if (!txData) {
    throw new Error("Tx data is not defined");
  }
  try {
    const txHash: string = yield web3Manager.sendTransaction(txData as any);
    yield put(actions.txSender.txSenderSigned(txHash));
    const txWithMetadata: TxWithMetadata = {
      transaction: {
        from: txData.from!,
        gas: addHexPrefix(Number(txData.gas!).toString(16)),
        gasPrice: "0x" + Number(txData.gasPrice!).toString(16),
        hash: txHash,
        input: txData.data || "0x0",
        nonce: "0x" + Number(txData.nonce!).toString(16),
        to: txData.to!,
        value: "0x" + Number(txData.value!).toString(16),
        blockHash: undefined,
        blockNumber: undefined,
        chainId: undefined,
        status: undefined,
        transactionIndex: undefined,
      },
      transactionType: type,
    };
    yield apiUserService.addPendingTx(txWithMetadata);
    yield neuCall(updateTxs);

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

// Debug sagas - can be removed after all transaction flows are implemented and e2e tested

function* signDummyMessage({ logger }: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "TX_SENDER_DEBUG_SIGN_DUMMY_MESSAGE") {
    return;
  }
  const message = action.payload.message;

  try {
    const signed = yield neuCall(
      signMessage,
      message,
      "Test Message",
      "Please sign this for me :)",
    );

    // this is just for demo purposes
    logger.info("signed: ", signed);
  } catch {
    logger.error("Error while signing a message :( ");
  }
}

function* sendDummyTx({ logger }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "TX_SENDER_DEBUG_SEND_DUMMY_TX") {
    return;
  }

  try {
    yield neuCall(txSendSaga, "WITHDRAW");
    logger.info("TX SENT SUCCESSFULLY!!");
  } catch (e) {
    logger.error("Error while sending tx :(", e);
  }
}

// connect actions

export const txSendingSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeEvery, "TX_SENDER_START_WITHDRAW_ETH", withdrawSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_INVESTMENT", investSaga);

  // Dev only
  yield fork(neuTakeEvery, "TX_SENDER_DEBUG_SIGN_DUMMY_MESSAGE", signDummyMessage);
  yield fork(neuTakeEvery, "TX_SENDER_DEBUG_SEND_DUMMY_TX", sendDummyTx);
};
