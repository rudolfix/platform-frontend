import { symbols } from "../../../di/symbols";
import { ILogger } from "../../../lib/dependencies/Logger";
import { TWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import { WalletStorage } from "../../../lib/persistence/WalletStorage";
import { BrowserWalletConnector } from "../../../lib/web3/BrowserWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { AppDispatch } from "../../../store";
import { actions } from "../../actions";
import { mapBrowserWalletErrorToErrorMessage } from "./errors";

const BROWSER_WALLET_TYPE = "investor";

export const browserWizardFlows = {
  tryConnectingWithBrowserWallet: injectableFn(
    async (
      dispatch: AppDispatch,
      browserWalletConnector: BrowserWalletConnector,
      web3Manager: Web3Manager,
      logger: ILogger,
      walletStorage: WalletStorage<TWalletMetadata>,
    ) => {
      try {
        const browserWallet = await browserWalletConnector.connect(web3Manager.networkId);

        await web3Manager.plugPersonalWallet(browserWallet);
        walletStorage.set(browserWallet.getMetadata(), BROWSER_WALLET_TYPE);
        dispatch(actions.walletSelector.connected(BROWSER_WALLET_TYPE));
      } catch (e) {
        logger.warn("Error while trying to connect with browser wallet: ", e.message);
        dispatch(
          actions.walletSelector.browserWalletConnectionError(
            mapBrowserWalletErrorToErrorMessage(e),
          ),
        );
      }
    },
    [
      symbols.appDispatch,
      symbols.browserWalletConnector,
      symbols.web3Manager,
      symbols.logger,
      symbols.walletStorage,
    ],
  ),
};
