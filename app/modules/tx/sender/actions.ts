import { createAction, createSimpleAction } from "../../actionsUtils";
import { ITxData } from "./../../../lib/web3/Web3Manager";
import { ETxSenderType, ETokenType } from './reducer';

export const txSenderActions = {
  // Modal related actions
  txSenderShowModal: (type: ETxSenderType) => createAction("TX_SENDER_SHOW_MODAL", { type }),
  txSenderHideModal: () => createSimpleAction("TX_SENDER_HIDE_MODAL"),
  // User awaiting actions
  txSenderAcceptDraft: (txData: ITxData) => createAction("TX_SENDER_ACCEPT_DRAFT", txData),
  txSenderAccept: () => createSimpleAction("TX_SENDER_ACCEPT"),
  // Signer actions
  txSenderSigned: (txHash: string) => createAction("TX_SENDER_SIGNED", { txHash }),
  txSenderWalletPlugged: () => createSimpleAction("TX_SENDER_WALLET_PLUGGED"),
  // Block mining actions
  txSenderReportBlock: (blockId: number) => createAction("TX_SENDER_REPORT_BLOCK", blockId),
  txSenderTxMined: () => createSimpleAction("TX_SENDER_TX_MINED"),
  // Pending transaction related actions
  txSenderWatchPendingTxs: () => createSimpleAction("TX_SENDER_WATCH_PENDING_TXS"),
  txSenderWatchPendingTxsDone: (type: ETxSenderType) =>
    createAction("TX_SENDER_WATCH_PENDING_TXS_DONE", { type }),
  // Error Actions
  txSenderError: (error: string) => createAction("TX_SENDER_ERROR", { error }),

  //Transaction flows 
  startWithdrawEth: () => createSimpleAction("TX_SENDER_START_WITHDRAW_ETH"),
  startUpgrade: (tokenType: ETokenType) => createAction("TX_SENDER_START_UPGRADE", tokenType),
  startInvestment: () => createSimpleAction("TX_SENDER_START_INVESTMENT"),
  // Add here new custom sagas that represent flow
};
