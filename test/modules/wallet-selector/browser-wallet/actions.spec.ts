import { expect } from "chai";
import { spy } from "sinon";
import { walletConnectedAction } from "../../../../app/modules/wallet-selector/actions";
import {
  browserWalletConnectionErrorAction,
  tryConnectingWithBrowserWallet,
} from "../../../../app/modules/wallet-selector/browser-wizard/actions";
import {
  BrowserWallet,
  BrowserWalletConnector,
  BrowserWalletLockedError,
} from "../../../../app/modules/web3/BrowserWallet";
import { Web3Manager } from "../../../../app/modules/web3/Web3Manager";
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

      await tryConnectingWithBrowserWallet(
        dispatchMock,
        browserWalletConnectorMock,
        web3ManagerMock,
        dummyLogger,
      );

      expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
      expect(dispatchMock).to.be.calledWithExactly(walletConnectedAction);
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

      await tryConnectingWithBrowserWallet(
        dispatchMock,
        browserWalletConnectorMock,
        web3ManagerMock,
        dummyLogger,
      );

      expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
      expect(dispatchMock).to.be.calledWithExactly(
        browserWalletConnectionErrorAction({
          errorMsg: "Your wallet seems to be locked — we can't access any accounts.",
        }),
      );
    });
  });
});
