import { expect } from "chai";
import { spy } from "sinon";
import {
  BrowserWallet,
  BrowserWalletConnector,
  BrowserWalletLockedError,
} from "../../../../app/lib/web3/BrowserWallet";
import { Web3Manager } from "../../../../app/lib/web3/Web3Manager";
import { actions } from "../../../../app/modules/actions";
import { walletFlows } from "../../../../app/modules/wallet-selector/flows";
import { dummyLogger, dummyNetworkId } from "../../../fixtures";
import { createMock } from "../../../testUtils";

describe("Wallet selector > Browser wizard > actions", () => {
  describe("tryConnectingWithBrowserWallet action", () => {
    it("should plug wallet on successful connection", async () => {
      const expectedNetworkId = dummyNetworkId;

      const dispatchMock = spy();
      const browserWalletMock = createMock(BrowserWallet, {});
      const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
        connect: async () => browserWalletMock,
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: expectedNetworkId,
        plugPersonalWallet: async () => {},
      });

      await walletFlows.tryConnectingWithBrowserWallet(
        dispatchMock,
        browserWalletConnectorMock,
        web3ManagerMock,
        dummyLogger,
      );

      expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
      expect(dispatchMock).to.be.calledWithExactly(walletFlows.walletConnected);
    });

    it("should dispatch error action on error", async () => {
      const expectedNetworkId = dummyNetworkId;

      const dispatchMock = spy();
      const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
        connect: async () => {
          throw new BrowserWalletLockedError();
        },
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: expectedNetworkId,
        plugPersonalWallet: async () => {},
      });

      await walletFlows.tryConnectingWithBrowserWallet(
        dispatchMock,
        browserWalletConnectorMock,
        web3ManagerMock,
        dummyLogger,
      );

      expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
      expect(dispatchMock).to.be.calledWithExactly(
        actions.wallet.browserWalletConnectionError(
          "Your wallet seems to be locked — we can't access any accounts.",
        ),
      );
    });
  });
});
