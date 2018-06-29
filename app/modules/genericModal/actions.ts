import { createAction, createSimpleAction } from "./../actionsUtils";
import { TIconType } from "./reducer";

export const genericModalActions = {
  showGenericModal: (
    title: string | React.ReactNode,
    description?: string | React.ReactNode,
    icon?: TIconType,
  ) => createAction("GENERIC_MODAL_SHOW", { title, description, icon }),

  showInfoModal: (title: string | React.ReactNode, description?: string | React.ReactNode) =>
    genericModalActions.showGenericModal(title, description, "check"),

  showErrorModal: (title: string, description?: string) =>
    genericModalActions.showGenericModal(title, description, "exclamation"),

  hideGenericModal: () => createSimpleAction("GENERIC_MODAL_HIDE"),
};
