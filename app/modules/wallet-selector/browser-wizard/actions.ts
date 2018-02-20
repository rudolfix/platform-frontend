import { createAction } from "../../actionsUtils";

export const browserWizardActions = {
  browserWalletConnectionError: (errorMsg: string) =>
    createAction("BROWSER_WALLET_CONNECTION_ERROR", { errorMsg }),
};
