import { createAction, createSimpleAction } from "../../actionsUtils";
import { ITxData, TxSenderType } from "./reducer";

export const txSenderActions = {
  withdrawEth: () => createSimpleAction("WITHDRAW_ETH"),
  txSenderShowModal: (type: TxSenderType) => createAction("TX_SENDER_SHOW_MODAL", { type }),
  txSenderHideModal: () => createSimpleAction("TX_SENDER_HIDE_MODAL"),
  txSenderAcceptDraft: (txData: Partial<ITxData>) => createAction("TX_SENDER_ACCEPT_DRAFT", txData),
  txSenderAccept: () => createSimpleAction("TX_SENDER_ACCEPT"),
  txSenderSigned: (txHash: string) => createAction("TX_SENDER_SIGNED", { txHash }),
  txSenderError: (error: string) => createAction("TX_SENDER_ERROR", { error }),
  txSenderWalletPlugged: () => createSimpleAction("TX_SENDER_WALLET_PLUGGED"),
  txSenderReportBlock: (blockId: number) => createAction("TX_SENDER_REPORT_BLOCK", blockId),
  txSenderTxMined: () => createSimpleAction("TX_SENDER_TX_MINED"),
};
