import { createAction, createSimpleAction } from "../actionsUtils";

export const signMessageModalActions = {
  show: () => createSimpleAction("SIGN_MESSAGE_MODAL_SHOW"),
  hide: () => createSimpleAction("SIGN_MESSAGE_MODAL_HIDE"),
  signingError: (errorMsg: string) => createAction("SIGN_MESSAGE_MODAL_SHOW_ERROR", { errorMsg }),
  accept: (password?: string) => createAction("SIGN_MESSAGE_ACCEPT", { password }),
  signed: (msg: string) => createAction("SIGN_MESSAGE_SIGNED", { msg }),
};
