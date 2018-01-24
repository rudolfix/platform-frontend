import { DispatchSymbol, NavigateTo, NavigateToSymbol } from "../../../getContainer";
import { injectableFn } from "../../../redux-injectify";
import { AppDispatch, IAppAction } from "../../../store";
import { makeActionCreator } from "../../../storeHelpers";
import { ILogger, LoggerSymbol } from "../../../utils/Logger";
import {
  BrowserWallet,
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError,
  BrowserWalletSymbol,
} from "../../web3/BrowserWallet";
import { Web3Manager, Web3ManagerSymbol } from "../../web3/Web3Manager";

export interface IBrowserWalletConnectionErrorAction extends IAppAction {
  type: "BROWSER_WALLET_CONNECTION_ERROR";
  payload: {
    errorMsg: string;
  };
}

export const browserWalletConnectionErrorAction = makeActionCreator<
  IBrowserWalletConnectionErrorAction
>("BROWSER_WALLET_CONNECTION_ERROR");

export const tryConnectingWithBrowserWallet = injectableFn(
  async (
    dispatch: AppDispatch,
    navigateTo: NavigateTo,
    browserWallet: BrowserWallet,
    web3Manager: Web3Manager,
    logger: ILogger,
  ) => {
    try {
      await browserWallet.connect(web3Manager.networkId);

      await web3Manager.plugPersonalWallet(browserWallet);
      navigateTo("/platform");
    } catch (e) {
      logger.warn("Error while trying to connect with browser wallet: ", e.message);
      dispatch(
        browserWalletConnectionErrorAction({ errorMsg: mapBrowserWalletErrorToErrorMessage(e) }),
      );
    }
  },
  [DispatchSymbol, NavigateToSymbol, BrowserWalletSymbol, Web3ManagerSymbol, LoggerSymbol],
);

function mapBrowserWalletErrorToErrorMessage(e: Error): string {
  if (e instanceof BrowserWalletLockedError) {
    return "Your wallet seems to be locked — we can't access any accounts.";
  }
  if (e instanceof BrowserWalletMismatchedNetworkError) {
    // @todo transform network ids to network names
    return `Your wallet is connected to the wrong network: ${
      e.actualNetworkId
    }. Please change the network.`;
  }
  if (e instanceof BrowserWalletMissingError) {
    return "We did not detect any Web3 wallet.";
  }
  return "Web3 wallet not available.";
}
