import { BigNumber } from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { END, eventChannel } from "redux-saga";
import { call, fork, put, race, select, take } from "redux-saga/effects";
import * as Web3 from "web3";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { TxWithMetadata } from "../../../lib/api/users/interfaces";
import {
  InvalidChangeIdError,
  InvalidRlpDataError,
  LongTransactionQueError,
  LowNonceError,
  NotEnoughFundsError,
  RevertedTransactionError,
  UnknownEthNodeError,
} from "../../../lib/web3/Web3Adapter";
import { IAppState } from "../../../store";
import { multiplyBigNumbers } from "../../../utils/BigNumberUtils";
import { connectWallet } from "../../accessWallet/sagas";
import { actions, TAction } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagas";
import { updateTxs } from "../monitor/sagas";
import {
  generateEtherUpgradeTransaction,
  generateEthWithdrawTransaction,
  generateEuroUpgradeTransaction,
  generateInvestmentTransaction,
} from "../transactionsGenerators/sagas";
import { OutOfGasError } from "./../../../lib/web3/Web3Adapter";
import { ITxData } from "./../../../lib/web3/Web3Manager";
import { ETokenType, ETxSenderType } from "./reducer";
import { selectTxDetails, selectTxType } from "./selectors";

export function* withdrawSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga(ETxSenderType.WITHDRAW, generateEthWithdrawTransaction);

    logger.info("Withdrawing successful");
  } catch (e) {
    logger.warn("Withdrawing cancelled", e);
  }
}

export function* upgradeSaga({ logger }: TGlobalDependencies, action: TAction): any {
  try {
    if (action.type !== "TX_SENDER_START_UPGRADE") return;
    if (action.payload === ETokenType.EURO) {
      yield txSendSaga(ETxSenderType.UPGRADE, generateEuroUpgradeTransaction);
    } else {
      yield txSendSaga(ETxSenderType.UPGRADE, generateEtherUpgradeTransaction);
    }

    logger.info("Withdrawing successful");
  } catch (e) {
    logger.error("Upgrade Saga Error", e);
    return yield put(actions.txSender.txSenderError("Error while generating Transaction"));
  }
}

export function* investSaga({ logger }: TGlobalDependencies): any {
  try {
    yield txSendSaga(ETxSenderType.INVEST, generateInvestmentTransaction);
    logger.info("Investment successful");
  } catch (e) {
    logger.warn("Investment cancelled", e);
  }
}

export function* txSendSaga(type: ETxSenderType, transactionGenerationFunction: any): any {
  const { result, cancel } = yield race({
    result: yield txSendProcess(type, transactionGenerationFunction),
    cancel: take("TX_SENDER_HIDE_MODAL"),
  });

  if (cancel) {
    throw new Error("TX_SENDING_CANCELLED");
  }

  // we need to wait for modal to close anyway
  yield take("TX_SENDER_HIDE_MODAL");
  yield put(actions.wallet.startLoadingWalletData());

  return result;
}

export function* txSendProcess(
  TransactionType: ETxSenderType,
  transactionGenerationFunction: any,
): any {
  try {
    yield put(actions.gas.gasApiEnsureLoading());
    yield put(actions.txSender.txSenderShowModal(TransactionType));

    yield neuCall(ensureNoPendingTx, TransactionType);

    let txDetails;
    if (TransactionType === "WITHDRAW" || TransactionType === "INVEST") {
      yield put(actions.txSender.txSenderWatchPendingTxsDone(TransactionType));
      txDetails = yield take("TX_SENDER_ACCEPT_DRAFT");
    }

    yield neuCall(transactionGenerationFunction, txDetails);

    yield take("TX_SENDER_ACCEPT");

    yield call(connectWallet, "Send funds!");
    yield put(actions.txSender.txSenderWalletPlugged());
    const txHash = yield neuCall(sendTxSubSaga);

    yield neuCall(watchTxSubSaga, txHash);
  } catch (error) {
    if (error instanceof OutOfGasError) {
      return yield put(actions.txSender.txSenderError("Gas too low"));
    } else if (error instanceof LowNonceError) {
      return yield put(actions.txSender.txSenderError("Nonce too low"));
    } else if (error instanceof LongTransactionQueError) {
      return yield put(actions.txSender.txSenderError("Too many transactions in que"));
    } else if (error instanceof InvalidRlpDataError) {
      return yield put(actions.txSender.txSenderError("Invalid RLP transaction"));
    } else if (error instanceof InvalidChangeIdError) {
      return yield put(actions.txSender.txSenderError("Invalid chain id"));
    } else if (error instanceof UnknownEthNodeError) {
      return yield put(actions.txSender.txSenderError("Tx was rejected"));
    }
  }
}

function* ensureNoPendingTx({ apiUserService, web3Manager, logger }: TGlobalDependencies): any {
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
}

function* sendTxSubSaga({ web3Manager, apiUserService }: TGlobalDependencies): any {
  const txData: ITxData = yield select((s: IAppState) => selectTxDetails(s.txSender));
  const type = yield select((s: IAppState) => selectTxType(s.txSender));
  if (!txData) {
    throw new Error("Tx data is not defined");
  }
  try {
    const userBalance: BigNumber = yield web3Manager.getBalance(txData.from);
    if (userBalance.comparedTo(multiplyBigNumbers([txData.gasPrice, txData.gas])) < 0)
      throw new NotEnoughFundsError();

    const txHash: string = yield web3Manager.sendTransaction(txData);
    yield put(actions.txSender.txSenderSigned(txHash));
    const txWithMetadata: TxWithMetadata = {
      transaction: {
        from: txData.from,
        gas: addHexPrefix(Number(txData.gas).toString(16)),
        gasPrice: "0x" + Number(txData.gasPrice).toString(16),
        hash: txHash,
        input: txData.data || "0x0",
        // TODO:Connect nonce
        nonce: "0x0",
        to: txData.to,
        value: "0x" + Number(txData.value).toString(16),
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
  } catch (error) {
    // @see https://github.com/paritytech/parity-ethereum/blob/61f4534e2a5f9c947661af0eaf4af5b76456efe0/rpc/src/v1/helpers/errors.rs#L304
    if (
      error.code === -32010 &&
      error.message.startsWith("Insufficient funds. The account you tried to send transaction")
    ) {
      return yield put(actions.txSender.txSenderError("Not enough funds"));
    }
    if (
      (error.code === -32000 && error.message === "intrinsic gas too low") ||
      (error.code === -32010 &&
        error.message.startsWith("Transaction gas is too low. There is not enough")) ||
      (error.code === -32010 && error.message.startsWith("exceeds current gas limit"))
    ) {
      throw new OutOfGasError();
    }

    if (error.code === -32010 && error.message.startsWith("Transaction nonce is too low")) {
      throw new LowNonceError();
    }
    if (
      error.code === -32010 &&
      error.message.startsWith("There are too many transactions in the queue")
    ) {
      throw new LongTransactionQueError();
    }
    if (error.code === -32010 && error.message.startsWith("Invalid RLP data")) {
      throw new InvalidRlpDataError();
    }
    if (error.code === -32010 && error.message.startsWith("Invalid chain id")) {
      throw new InvalidChangeIdError();
    }
  }
  throw new UnknownEthNodeError();
}

function* watchTxSubSaga({ logger }: TGlobalDependencies, txHash: string): any {
  const watchTxChannel = yield neuCall(createWatchTxChannel, txHash);
  try {
    while (true) {
      const result: TEventEmitterChannelEvents = yield take(watchTxChannel);
      switch (result.type) {
        case EventEmitterChannelEvents.NEW_BLOCK:
          yield put(actions.txSender.txSenderReportBlock(result.blockId));
          break;
        case EventEmitterChannelEvents.TX_MINED:
          return yield put(actions.txSender.txSenderTxMined());
        case EventEmitterChannelEvents.ERROR:
          logger.error("Error while tx watching: ", result.error);
          return yield put(actions.txSender.txSenderError("Error while watching tx."));
        case EventEmitterChannelEvents.OUT_OF_GAS:
          logger.error("Error Transaction Reverted: ", result.error);
          return yield put(actions.txSender.txSenderError("Out of gas"));
        case EventEmitterChannelEvents.REVERTED_TRANSACTION:
          logger.error("Error Transaction Reverted: ", result.error);
          return yield put(actions.txSender.txSenderError("Reverted Transaction"));
      }
    }
  } finally {
    watchTxChannel.close();
    logger.info("Stopped Watching for TXs");
  }
}

enum EventEmitterChannelEvents {
  NEW_BLOCK = "NEW_BLOCK",
  TX_MINED = "TX_MINED",
  ERROR = "ERROR",
  REVERTED_TRANSACTION = "REVERTED_TRANSACTION",
  OUT_OF_GAS = "OUT_OF_GAS",
}
type TEventEmitterChannelEvents =
  | {
      type: EventEmitterChannelEvents.NEW_BLOCK;
      blockId: number;
    }
  | {
      type: EventEmitterChannelEvents.TX_MINED;
      tx: Web3.Transaction;
    }
  | {
      type: EventEmitterChannelEvents.ERROR;
      error: any;
    }
  | {
      type: EventEmitterChannelEvents.REVERTED_TRANSACTION;
      error: any;
    }
  | {
      type: EventEmitterChannelEvents.OUT_OF_GAS;
      error: any;
    };

const createWatchTxChannel = ({ web3Manager }: TGlobalDependencies, txHash: string) =>
  eventChannel<TEventEmitterChannelEvents>(emitter => {
    web3Manager.internalWeb3Adapter
      .waitForTx({
        txHash,
        onNewBlock: async blockId => {
          emitter({ type: EventEmitterChannelEvents.NEW_BLOCK, blockId });
        },
      })
      .then(tx => emitter({ type: EventEmitterChannelEvents.TX_MINED, tx }))
      .catch(error => {
        if (error instanceof RevertedTransactionError) {
          emitter({ type: EventEmitterChannelEvents.REVERTED_TRANSACTION, error });
        } else if (error instanceof OutOfGasError) {
          emitter({ type: EventEmitterChannelEvents.OUT_OF_GAS, error });
        } else {
          emitter({ type: EventEmitterChannelEvents.ERROR, error });
        }
      })
      .then(() => emitter(END));
    return () => {
      // @todo missing unsubscribe
    };
  });

export const txSendingSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeEvery, "TX_SENDER_START_WITHDRAW_ETH", withdrawSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_UPGRADE", upgradeSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_INVESTMENT", investSaga);
  // Claim
};
