import { createActionFactory } from "@neufund/shared";

export const authActions = {
  /**
   * New account creation flow
   */
  createNewAccount: createActionFactory("AUTH_CREATE_NEW_ACCOUNT"),
  failedToCreateNewAccount: createActionFactory("AUTH_ACCOUNT_CREATION_FAILED"),

  /**
   * Import account flow
   */
  importNewAccount: createActionFactory(
    "AUTH_IMPORT_NEW_ACCOUNT",
    (privateKeyOrMnemonics: string) => ({ privateKeyOrMnemonics }),
  ),
  failedToImportNewAccount: createActionFactory("AUTH_ACCOUNT_IMPORT_FAILED"),

  /**
   * Logout flow
   */
  logout: createActionFactory("AUTH_LOGOUT"),

  /**
   * Sign in flow
   */
  signIn: createActionFactory("AUTH_SIGN_IN"),
  signed: createActionFactory("AUTH_NEW_ACCOUNT_SIGNED"),
};
