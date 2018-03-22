import { createAction, createSimpleAction } from "./../actionsUtils";
import { icon } from "./reducer";

export const genericModalActions = {
  showGenericModal: (title: string, description?: string, icon?: icon) =>
    createAction("GENERIC_MODAL_SHOW", { title, description, icon }),
  hideGenericModal: () => createSimpleAction("GENERIC_MODAL_HIDE"),
};
