import { createSimpleAction } from "../actionsUtils";

export const sendModalActions = {
  showSendEthModal: () => createSimpleAction("SEND_ETH_MODAL_SHOW"),
  hideSendEthModal: () => createSimpleAction("SEND_ETH_MODAL_HIDE"),
};
