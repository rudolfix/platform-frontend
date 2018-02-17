import { IAppAction } from "../../../store";
import { makeActionCreator } from "../../../storeHelpers";

export const browserWizzardActions = {};

export interface IBrowserWalletConnectionErrorAction extends IAppAction {
  type: "BROWSER_WALLET_CONNECTION_ERROR";
  payload: {
    errorMsg: string;
  };
}

export const browserWalletConnectionErrorAction = makeActionCreator<
  IBrowserWalletConnectionErrorAction
>("BROWSER_WALLET_CONNECTION_ERROR");
