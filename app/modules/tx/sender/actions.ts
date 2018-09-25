import { createAction, createSimpleAction } from "../../actionsUtils";
import { ITxData } from "./../../../lib/web3/Web3Manager";
import { TxSenderType } from "./reducer";

export const txSenderActions = {
  txSenderShowModal: (type: TxSenderType) => createAction("TX_SENDER_SHOW_MODAL", { type }),
  txSenderHideModal: () => createSimpleAction("TX_SENDER_HIDE_MODAL"),
  txSenderAcceptDraft: (txData: ITxData) => createAction("TX_SENDER_ACCEPT_DRAFT", txData),
  txSenderAccept: () => createSimpleAction("TX_SENDER_ACCEPT"),
  txSenderSigned: (txHash: string) => createAction("TX_SENDER_SIGNED", { txHash }),
  txSenderWalletPlugged: () => createSimpleAction("TX_SENDER_WALLET_PLUGGED"),
  txSenderReportBlock: (blockId: number) => createAction("TX_SENDER_REPORT_BLOCK", blockId),
  txSenderTxMined: () => createSimpleAction("TX_SENDER_TX_MINED"),
  generateWithdrawTx: (txData: ITxData) => createAction("TX_SENDER_GENERATE_TX", txData),

  // Transaction inititiation
  startWithdrawEth: () => createSimpleAction("TX_SENDER_START_WITHDRAW_ETH"),
  startInvestment: () => createSimpleAction("TX_SENDER_START_INVESTMENT"),

  // Pending transaction related actions
  txSenderWatchPendingTxs: () => createSimpleAction("TX_SENDER_WATCH_PENDING_TXS"),
  txSenderWatchPendingTxsDone: (type: TxSenderType) =>
    createAction("TX_SENDER_WATCH_PENDING_TXS_DONE", { type }),
  // Error Actions
  txSenderError: (error: string) => createAction("TX_SENDER_ERROR", { error }),

  // This is only for development, can be removed after all flows are implemented and e2e tested
  signDebugDummyMessage: (message: string) =>
    createAction("TX_SENDER_DEBUG_SIGN_DUMMY_MESSAGE", { message }),
  sendDebugDummyTx: () => createSimpleAction("TX_SENDER_DEBUG_SEND_DUMMY_TX"),
};
