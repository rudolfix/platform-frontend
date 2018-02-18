import { injectableFn } from "../../../redux-injectify";
import { AppDispatch } from "../../../store";
import { symbols } from "../../../symbols";
import { ILogger } from "../../../utils/Logger";
import { actions } from "../../actions";
import {
  BrowserWalletConnector,
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError,
} from "../../web3/BrowserWallet";
import { ethereumNetworkIdToNetworkName } from "../../web3/utils";
import { Web3Manager } from "../../web3/Web3Manager";
import { walletFlows } from "../flows";

export const browserWizardFlows = {
  tryConnectingWithBrowserWallet: injectableFn(
    async (
      dispatch: AppDispatch,
      browserWalletConnector: BrowserWalletConnector,
      web3Manager: Web3Manager,
      logger: ILogger,
    ) => {
      try {
        const browserWallet = await browserWalletConnector.connect(web3Manager.networkId!);

        await web3Manager.plugPersonalWallet(browserWallet);
        dispatch(walletFlows.walletConnected);
      } catch (e) {
        logger.warn("Error while trying to connect with browser wallet: ", e.message);
        dispatch(
          actions.wallet.browserWalletConnectionError(mapBrowserWalletErrorToErrorMessage(e)),
        );
      }
    },
    [symbols.appDispatch, symbols.browserWalletConnector, symbols.web3Manager, symbols.logger],
  ),
};

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
