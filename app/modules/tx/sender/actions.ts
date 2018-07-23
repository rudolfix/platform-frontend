import { createAction, createSimpleAction } from "../../actionsUtils";
import { ITxData, TxSenderType } from "./reducer";

export const txSenderActions = {
  txSenderShowModal: (type: TxSenderType) => createAction("TX_SENDER_SHOW_MODAL", { type }),
  txSenderHideModal: () => createSimpleAction("TX_SENDER_HIDE_MODAL"),
  txSenderAcceptDraft: (txData: ITxData) => createAction("TX_SENDER_ACCEPT_DRAFT", txData),
  txSenderAccept: () => createSimpleAction("TX_SENDER_ACCEPT"),
  txSenderSigned: () => createSimpleAction("TX_SENDER_SIGNED"),
  txSenderError: (error: string) => createAction("TX_SENDER_ERROR", { error }),
  txSenderReportBlock: (blockId: number) => createAction("TX_SENDER_REPORT_BLOCK", blockId),
  txSenderTxMined: () => createSimpleAction("TX_SENDER_TX_MINED"),
};
