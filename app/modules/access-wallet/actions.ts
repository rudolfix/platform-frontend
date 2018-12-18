import { TMessage } from "../../components/translatedMessages/utils";
import { createAction, createSimpleAction } from "../actionsUtils";

export const accessWalletActions = {
  showAccessWalletModal: (title: TMessage, message: TMessage) =>
    createAction("SHOW_ACCESS_WALLET_MODAL", { title, message }),
  hideAccessWalletModal: () => createSimpleAction("HIDE_ACCESS_WALLET_MODAL"),
  signingError: (errorMessage: TMessage) =>
    createAction("ACCESS_WALLET_SIGNING_ERROR", { errorMessage }),
  clearSigningError: () => createSimpleAction("ACCESS_WALLET_CLEAR_SIGNING_ERROR"),
  accept: (password?: string) => createAction("ACCESS_WALLET_ACCEPT", { password }),
};
