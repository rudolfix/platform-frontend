import { createAction } from "../actionsUtils";

export const settingsActions = {
  addNewEmail: (email: string) => createAction("SETTINGS_ADD_NEW_EMAIL", { email }),
};
