import { ReactNode } from "react";

import { createAction, createSimpleAction } from "../../actionsUtils";
import { TxSenderType } from "./reducer";

export const txSenderActions = {
  txSenderShowModal: (type: TxSenderType) => createAction("TX_SENDER_SHOW_MODAL", { type }),
  txSenderHideModal: () => createSimpleAction("TX_SENDER_HIDE_MODAL"),
};
