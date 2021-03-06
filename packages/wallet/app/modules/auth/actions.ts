import { createActionFactory } from "@neufund/shared-utils";

import { TAuthWalletMetadata } from "./types";

export const authActions = {
  /**
   * New account creation flow
   */
  canCreateAccount: createActionFactory("AUTH_CAN_CREATE_ACCOUNT"),
  createAccount: createActionFactory("AUTH_CREATE_ACCOUNT"),
  failedToCreateAccount: createActionFactory("AUTH_ACCOUNT_CREATION_FAILED"),

  /**
   * Import account flow
   */
  importAccount: createActionFactory(
    "AUTH_IMPORT_ACCOUNT",
    (privateKeyOrMnemonic: string, name?: string) => ({
      privateKeyOrMnemonic,
      name,
    }),
  ),
  failedToImportAccount: createActionFactory("AUTH_ACCOUNT_IMPORT_FAILED"),

  /**
   * Switch account flow
   */
  switchAccount: createActionFactory(
    "AUTH_SWITCH_ACCOUNT",
    (privateKeyOrMnemonic: string, name?: string) => ({
      privateKeyOrMnemonic,
      name,
    }),
  ),

  /**
   * Unlock account flow
   */
  canUnlockAccount: createActionFactory(
    "AUTH_UNLOCK_CAN_UNLOCK",
    (metadata: TAuthWalletMetadata) => ({ metadata }),
  ),
  unlockAccount: createActionFactory("AUTH_UNLOCK_UNLOCK"),
  failedToUnlockAccount: createActionFactory("AUTH_UNLOCK_FAILED_TO_UNLOCK"),

  /**
   * Lock account flow
   */
  lockAccount: createActionFactory("AUTH_LOCK_ACCOUNT"),
  lockAccountDone: createActionFactory("AUTH_LOCK_ACCOUNT_DONE"),

  /**
   * Logout flow
   */
  logout: createActionFactory("AUTH_LOGOUT"),
  logoutDone: createActionFactory("AUTH_LOGOUT_DONE"),

  /**
   * Sign in flow
   */
  signIn: createActionFactory("AUTH_SIGN_IN"),
  signed: createActionFactory("AUTH_NEW_ACCOUNT_SIGNED", (metadata: TAuthWalletMetadata) => ({
    metadata,
  })),
};
