import { createAction, createSimpleAction } from "../actionsUtils";

export const showSeedModalActions = {
  seedModelshow: () => createSimpleAction("SEED_MODAL_SHOW"),
  seedModelhide: () => createSimpleAction("SEED_MODAL_HIDE"),
  seedModelError: (errorMsg: string) => createAction("SEED_MODAL_SHOW_ERROR", { errorMsg }),
  seedModelAccept: (password?: string) => createAction("SEED_ACCEPT", { password }),
  seedModelSigned: (msg: string) => createAction("SEED_SIGNED", { msg }),
};
