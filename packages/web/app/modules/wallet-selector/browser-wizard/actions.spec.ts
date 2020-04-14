import { expectSaga } from "@neufund/sagas/tests";
import { EWalletSubType, EWalletType, noopLogger } from "@neufund/shared-modules";
import { createMock } from "@neufund/shared/tests";
import { expect } from "chai";

import { dummyEthereumAddressWithChecksum, dummyNetworkId } from "../../../../test/fixtures";
import { BrowserWalletErrorMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import {
  BrowserWallet,
  BrowserWalletLockedError,
} from "../../../lib/web3/browser-wallet/BrowserWallet";
import { BrowserWalletConnector } from "../../../lib/web3/browser-wallet/BrowserWalletConnector";
import { Web3Manager } from "../../../lib/web3/Web3Manager/Web3Manager";
import { TAppGlobalState } from "../../../store";
import { actions } from "../../actions";
import { IBrowserWalletMetadata } from "../../web3/types";
import { tryConnectingWithBrowserWallet } from "./sagas";

// tslint:disable: no-object-literal-type-assertion
const getStateMock: () => TAppGlobalState = () =>
  <TAppGlobalState>{
    browserWalletWizardState: {
      approvalRejected: false,
    },
  };
/* tslint:enable:no-object-literal-type-assertion */

describe("Wallet selector > Browser wizard > actions", () => {
  describe("tryConnectingWithBrowserWallet action", () => {
    it("should plug wallet on successful connection", async () => {
      const expectedNetworkId = dummyNetworkId;
      const dummyMetadata: IBrowserWalletMetadata = {
        address: dummyEthereumAddressWithChecksum,
        walletType: EWalletType.BROWSER,
        walletSubType: EWalletSubType.METAMASK,
      };

      const browserWalletMock = createMock(BrowserWallet, {
        getMetadata: () => dummyMetadata,
      });
      const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
        connect: async () => browserWalletMock,
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: expectedNetworkId,
        plugPersonalWallet: async () => {},
      });

      await expectSaga(tryConnectingWithBrowserWallet, {
        browserWalletConnector: browserWalletConnectorMock as any,
        web3Manager: web3ManagerMock as any,
        logger: noopLogger as any,
      } as TGlobalDependencies)
        .withState(getStateMock())
        .put(actions.walletSelector.connected())
        .run();

      expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
    });

    it("should dispatch error action on error", async () => {
      const expectedNetworkId = dummyNetworkId;

      const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
        connect: async () => {
          throw new BrowserWalletLockedError();
        },
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: expectedNetworkId,
        plugPersonalWallet: async () => {},
      });

      await expectSaga(tryConnectingWithBrowserWallet, {
        browserWalletConnector: browserWalletConnectorMock as any,
        web3Manager: web3ManagerMock as any,
        logger: noopLogger as any,
      } as TGlobalDependencies)
        .withState(getStateMock())
        .put(
          actions.walletSelector.browserWalletConnectionError(
            createMessage(BrowserWalletErrorMessage.WALLET_IS_LOCKED),
          ),
        )
        .run();

      expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
    });
  });
});
