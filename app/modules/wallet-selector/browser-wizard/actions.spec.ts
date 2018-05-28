import { expect } from "chai";
import { spy } from "sinon";
import { dummyEthereumAddress, dummyNetworkId } from "../../../../test/fixtures";
import { createMock } from "../../../../test/testUtils";
import { noopLogger } from "../../../lib/dependencies/Logger";
import { ObjectStorage } from "../../../lib/persistence/ObjectStorage";
import {
  IBrowserWalletMetadata,
  TWalletMetadata,
} from "../../../lib/persistence/WalletMetadataObjectStorage";
import { WalletStorage } from "../../../lib/persistence/WalletStorage";
import {
  BrowserWallet,
  BrowserWalletConnector,
  BrowserWalletLockedError,
} from "../../../lib/web3/BrowserWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { IAppState } from "../../../store";
import { DeepPartial } from "../../../types";
import { actions } from "../../actions";
import { WalletType } from "../../web3/types";
import { walletFlows } from "../flows";

describe("Wallet selector > Browser wizard > actions", () => {
  describe("tryConnectingWithBrowserWallet action", () => {
    it("should plug wallet on successful connection", async () => {
      const expectedNetworkId = dummyNetworkId;
      const dummyMetadata: IBrowserWalletMetadata = {
        address: dummyEthereumAddress,
        walletType: WalletType.BROWSER,
      };
      const getStateMock: () => DeepPartial<IAppState> = () => ({
        router: {
          location: {
            pathname: "/eto/login/browser",
          },
        },
      });

      const dispatchMock = spy();
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
      const walletStorageMock: WalletStorage<TWalletMetadata> = createMock(WalletStorage, {
        set: () => {},
      }) as any;

      await walletFlows.tryConnectingWithBrowserWallet(
        dispatchMock,
        browserWalletConnectorMock,
        web3ManagerMock,
        noopLogger,
        walletMetadataStorageMock,
        getStateMock as any,
      );

      expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
      expect(walletStorageMock.set).to.be.calledWithExactly(dummyMetadata, "investor");
      expect(dispatchMock).to.be.calledWithExactly(actions.walletSelector.connected("investor"));
    });

    it("should dispatch error action on error", async () => {
      const expectedNetworkId = dummyNetworkId;

      const dispatchMock = spy();
      const getStateMock: () => DeepPartial<IAppState> = () => ({
        router: {
          location: {
            pathname: "/eto/login/browser",
          },
        },
      });
      const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
        connect: async () => {
          throw new BrowserWalletLockedError();
        },
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: expectedNetworkId,
        plugPersonalWallet: async () => {},
      });
      const walletStorageMock: WalletStorage<TWalletMetadata> = createMock(WalletStorage, {
        set: () => {},
      }) as any;

      await walletFlows.tryConnectingWithBrowserWallet(
        dispatchMock,
        browserWalletConnectorMock,
        web3ManagerMock,
        noopLogger,
        walletMetadataStorageMock,
        getStateMock as any,
      );

      expect(browserWalletConnectorMock.connect).to.be.calledWithExactly(expectedNetworkId);
      expect(walletStorageMock.set).to.not.be.called;
      expect(dispatchMock).to.be.calledWithExactly(
        actions.walletSelector.browserWalletConnectionError(
          "Your wallet seems to be locked — we can't access any accounts",
        ),
      );
    });
  });
});
