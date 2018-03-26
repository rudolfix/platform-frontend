import { createAction, createSimpleAction } from "../actionsUtils";

export const accessWalletActions = {
  showAccessWalletModal: (title: string, message: string) =>
    createAction("SHOW_ACCESS_WALLET_MODAL", { title, message }),
  hideAccessWalletModal: () => createSimpleAction("HIDE_ACCESS_WALLET_MODAL"),
  signingError: (errorMsg: string) => createAction("ACCESS_WALLET_SIGNING_ERROR", { errorMsg }),
  accept: (password?: string) => createAction("ACCESS_WALLET_ACCEPT", { password }),
};
