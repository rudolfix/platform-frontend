import { createAction, createSimpleAction } from "../../actionsUtils";

export const lightWizardActions = {
  lightWalletConnectionError: (errorMsg: string) =>
    createAction("LIGHT_WALLET_CONNECTION_ERROR", { errorMsg }),
  lightWalletReset: () => createSimpleAction("LIGHT_WALLET_RESET"),
  lightWalletLogin: (email: string, password: string) =>
    createAction("LIGHT_WALLET_LOGIN", { email, password }),
  lightWalletBackedUp: () => createSimpleAction("LIGHT_WALLET_BACKUP"),
};
