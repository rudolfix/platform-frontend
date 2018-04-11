import { createAction, createSimpleAction } from "../actionsUtils";

export const settingsActions = {
  addNewEmail: (email: string) => createAction("SETTINGS_ADD_NEW_EMAIL", { email }),
  resendEmail: () => createSimpleAction("SETTINGS_RESEND_EMAIL"),
  loadSeedOrReturnToSettings: () => createSimpleAction("LOAD_SEED_OR_RETURN_TO_SETTINGS"),
};
