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
import { connectWallet, signMessage } from "../../accessWallet/sagas";
import { actions, TAction } from "../../actions";
import { neuCall, neuFork, neuTakeEvery } from "../../sagas";
import { selectEthereumAddressWithChecksum } from "../../web3/selectors";
import { updateTxs } from "../monitor/sagas";
import { generateEtherUpgradeTransaction, generateEuroUpgradeTransaction } from "../upgrade/sagas";
import { OutOfGasError } from "./../../../lib/web3/Web3Adapter";
import { ITxData } from "./../../../lib/web3/Web3Manager";
import { selectEtherTokenBalance } from "./../../wallet/selectors";
import { ETokenType } from "./actions";
import { ETxSenderType } from "./reducer";
import { selectTxDetails, selectTxType } from "./selectors";

export function* withdrawSaga({ logger }: TGlobalDependencies): any {
  try {
    yield neuCall(txSendSaga, "WITHDRAW");

    logger.info("Withdrawing successful");
  } catch (e) {
    logger.warn("Withdrawing cancelled", e);
  }
}

export function* upgradeSaga({ logger }: TGlobalDependencies, action: TAction): any {
  try {
    yield neuFork(txSendSaga, "UPGRADE");
    const { accept, cancel } = yield race({
      accept: take("TX_SENDER_WATCH_PENDING_TXS_DONE"),
      cancel: take("TX_SENDER_HIDE_MODAL"),
    });
    if (cancel) {
      logger.warn("Withdrawing cancelled");
      return;
    }
    if (accept) {
      if (action.type !== "TX_SENDER_START_UPGRADE_ETH") return;
      if (action.payload === ETokenType.EURO) {
        yield neuCall(generateEuroUpgradeTransaction);
      } else {
        yield neuCall(generateEtherUpgradeTransaction);
      }

      logger.info("Withdrawing successful");
    }
  } catch (e) {
    logger.error("Upgrade Saga Error", e);
    return yield put(actions.txSender.txSenderError("Error while generating Transaction"));
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

export function* txSendSaga(_: TGlobalDependencies, type: ETxSenderType): any {
  const { result, cancel } = yield race({
    result: neuCall(txSendProcess, type),
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

export function* txSendProcess(_: TGlobalDependencies, type: ETxSenderType): any {
  try {
    yield put(actions.gas.gasApiEnsureLoading());
    yield put(actions.txSender.txSenderShowModal(type));

    yield neuCall(ensureNoPendingTx, type);

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

function* ensureNoPendingTx(
  { apiUserService, web3Manager, logger }: TGlobalDependencies,
  type: ETxSenderType,
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

function* generateEthWithdrawTransaction(
  { contractsService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "TX_SENDER_GENERATE_TX") return;

  const txStateDetails = action.payload;

  let txDetails: ITxData | undefined;
  if (!txStateDetails) return;
  const etherTokenBalance = yield select((s: IAppState) => selectEtherTokenBalance(s.wallet));
  const from = yield select((s: IAppState) => selectEthereumAddressWithChecksum(s.web3));

  // transaction can be fully covered by etherTokens

  const txInput = contractsService.etherToken
    .withdrawAndSendTx(txStateDetails.to, new BigNumber(txStateDetails.value))
    .getData();
  const ethVal = new BigNumber(txStateDetails.value);
  const difference = ethVal.sub(etherTokenBalance);

  txDetails = {
    to: contractsService.etherToken.address,
    from,
    data: txInput,
    value: difference.comparedTo(0) > 0 ? difference.toString() : "0",
    gas: txStateDetails.gas,
    gasPrice: txStateDetails.gasPrice,
  };
  if (txDetails) {
    yield put(actions.txSender.txSenderAcceptDraft(txDetails));
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
  yield fork(neuTakeEvery, "TX_SENDER_START_UPGRADE_ETH", upgradeSaga);
  yield fork(neuTakeEvery, "TX_SENDER_START_INVESTMENT", investSaga);
  yield fork(neuTakeEvery, "TX_SENDER_GENERATE_TX", generateEthWithdrawTransaction);

  // Dev only
  yield fork(neuTakeEvery, "TX_SENDER_DEBUG_SIGN_DUMMY_MESSAGE", signDummyMessage);
  yield fork(neuTakeEvery, "TX_SENDER_DEBUG_SEND_DUMMY_TX", sendDummyTx);
};
