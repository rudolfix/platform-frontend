import { createAction } from "../../actions";

export const browserWizzardActions = {
  browserWalletConnectionError: (errorMsg: string) =>
    createAction("BROWSER_WALLET_CONNECTION_ERROR", { errorMsg }),
};
