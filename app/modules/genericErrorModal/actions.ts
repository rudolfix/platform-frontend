import { createAction, createSimpleAction } from "./../actionsUtils";

export const genericErrorModalActions = {
  showError: (mainError: string, errorMsg: string) =>
    createAction("GENERIC_ERROR_MODAL_SHOW", { mainError, errorMsg }),
  hideError: () => createSimpleAction("GENERIC_ERROR_MODAL_HIDE"),
};
