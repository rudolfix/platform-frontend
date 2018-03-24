import { createAction, createSimpleAction } from "./../actionsUtils";
import { TIconType } from "./reducer";

export const genericModalActions = {
  showGenericModal: (title: string, description?: string, icon?: TIconType) =>
    createAction("GENERIC_MODAL_SHOW", { title, description, icon }),

  showGenericConfirmationModal: (title: string, description?: string) =>
    genericModalActions.showGenericModal(title, description, "check"),

  showGenericErrorModal: (title: string, description?: string) =>
    genericModalActions.showGenericModal(title, description, "exclamation"),

  hideGenericModal: () => createSimpleAction("GENERIC_MODAL_HIDE"),
};
