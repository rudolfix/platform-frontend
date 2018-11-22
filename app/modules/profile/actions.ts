import { createAction, createSimpleAction } from "../actionsUtils";

export const profileActions = {
  addNewEmail: (email: string) => createAction("PROFILE_ADD_NEW_EMAIL", { email }),
  cancelEmail: () => createSimpleAction("PROFILE_CANCEL_EMAIL"),
  revertCancelEmail: () => createSimpleAction("PROFILE_REVERT_CANCEL_EMAIL"),
  resendEmail: () => createSimpleAction("PROFILE_RESEND_EMAIL"),
  loadSeedOrReturnToProfile: () => createSimpleAction("LOAD_SEED_OR_RETURN_TO_PROFILE"),
};
