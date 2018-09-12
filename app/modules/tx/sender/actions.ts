import { createAction, createSimpleAction } from "../../actionsUtils";
import { ITxData } from "./../../../lib/web3/Web3Manager";
import { TxSenderType } from "./reducer";

export const txSenderActions = {
  startWithdrawEth: () => createSimpleAction("TX_SENDER_START_WITHDRAW_ETH"),
  startInvestment: () => createSimpleAction("TX_SENDER_START_INVESTMENT"),
  txSenderShowModal: (type: TxSenderType) => createAction("TX_SENDER_SHOW_MODAL", { type }),
  txSenderHideModal: () => createSimpleAction("TX_SENDER_HIDE_MODAL"),
  txSenderWatchPendingTxs: () => createSimpleAction("TX_SENDER_WATCH_PENDING_TXS"),
  txSenderWatchPendingTxsDone: (type: TxSenderType) =>
    createAction("TX_SENDER_WATCH_PENDING_TXS_DONE", { type }),
  txSenderAcceptDraft: (txData: Partial<ITxData>) => createAction("TX_SENDER_ACCEPT_DRAFT", txData),
  txSenderAccept: () => createSimpleAction("TX_SENDER_ACCEPT"),
  txSenderSigned: (txHash: string) => createAction("TX_SENDER_SIGNED", { txHash }),
  txSenderError: (error: string) => createAction("TX_SENDER_ERROR", { error }),
  txSenderWalletPlugged: () => createSimpleAction("TX_SENDER_WALLET_PLUGGED"),
  txSenderReportBlock: (blockId: number) => createAction("TX_SENDER_REPORT_BLOCK", blockId),
  txSenderTxMined: () => createSimpleAction("TX_SENDER_TX_MINED"),
};
