import { APP_DISPATCH_SYMBOL } from "../../../getContainer";
import { injectableFn } from "../../../redux-injectify";
import { AppDispatch, IAppAction } from "../../../store";
import { makeActionCreator } from "../../../storeHelpers";
import { ILogger, LOGGER_SYMBOL } from "../../../utils/Logger";
import {
  BROWSER_WALLET_CONNECTOR_SYMBOL,
  BrowserWalletConnector,
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError,
} from "../../web3/BrowserWallet";
import { ethereumNetworkIdToNetworkName } from "../../web3/utils";
import { WEB3_MANAGER_SYMBOL, Web3Manager } from "../../web3/Web3Manager";
import { walletConnectedAction } from "../actions";

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
    browserWalletConnector: BrowserWalletConnector,
    web3Manager: Web3Manager,
    logger: ILogger,
  ) => {
    try {
      const browserWallet = await browserWalletConnector.connect(web3Manager.networkId);

      await web3Manager.plugPersonalWallet(browserWallet);
      dispatch(walletConnectedAction);
    } catch (e) {
      logger.warn("Error while trying to connect with browser wallet: ", e.message);
      dispatch(
        browserWalletConnectionErrorAction({ errorMsg: mapBrowserWalletErrorToErrorMessage(e) }),
      );
    }
  },
  [APP_DISPATCH_SYMBOL, BROWSER_WALLET_CONNECTOR_SYMBOL, WEB3_MANAGER_SYMBOL, LOGGER_SYMBOL],
);

function mapBrowserWalletErrorToErrorMessage(e: Error): string {
  if (e instanceof BrowserWalletLockedError) {
    return "Your wallet seems to be locked — we can't access any accounts.";
  }
  if (e instanceof BrowserWalletMismatchedNetworkError) {
    // @todo transform network ids to network names
    return `Your wallet is connected to the wrong network: ${ethereumNetworkIdToNetworkName(
      e.actualNetworkId,
    )}. Please change the network.`;
  }
  if (e instanceof BrowserWalletMissingError) {
    return "We did not detect any Web3 wallet.";
  }
  return "Web3 wallet not available.";
}
