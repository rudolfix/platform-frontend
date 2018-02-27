import { symbols } from "../../../di/symbols";
import { ILogger } from "../../../lib/dependencies/Logger";
import { ObjectStorage } from "../../../lib/persistence/ObjectStorage";
import { TWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import { BrowserWalletConnector } from "../../../lib/web3/BrowserWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { AppDispatch } from "../../../store";
import { actions } from "../../actions";
import { WalletType } from "../../web3/types";
import { mapBrowserWalletErrorToErrorMessage } from "./errors";

export const browserWizardFlows = {
  tryConnectingWithBrowserWallet: injectableFn(
    async (
      dispatch: AppDispatch,
      browserWalletConnector: BrowserWalletConnector,
      web3Manager: Web3Manager,
      logger: ILogger,
      walletMetadataStorage: ObjectStorage<TWalletMetadata>,
    ) => {
      try {
        const browserWallet = await browserWalletConnector.connect(web3Manager.networkId!);

        await web3Manager.plugPersonalWallet(browserWallet);
        // todo move saving metadata to unified connect functions
        // todo browser wallet should save and verify address
        walletMetadataStorage.set({
          walletType: WalletType.BROWSER,
        });
        dispatch(actions.wallet.connected());
      } catch (e) {
        logger.warn("Error while trying to connect with browser wallet: ", e.message);
        dispatch(
          actions.wallet.browserWalletConnectionError(mapBrowserWalletErrorToErrorMessage(e)),
        );
      }
    },
    [
      symbols.appDispatch,
      symbols.browserWalletConnector,
      symbols.web3Manager,
      symbols.logger,
      symbols.walletMetadataStorage,
    ],
  ),
};
