import { BigNumber } from "bignumber.js";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Container } from "inversify";
import { appRoutes } from "../../../app/components/AppRouter";
import { BROWSER_WALLET_RECONNECT_INTERVAL } from "../../../app/components/walletSelector/WalletBrowser";
import { LEDGER_RECONNECT_INTERVAL } from "../../../app/components/walletSelector/WalletLedgerInitComponent";
import { WalletSelector } from "../../../app/components/walletSelector/WalletSelector";
import { APP_DISPATCH_SYMBOL } from "../../../app/getContainer";
import { obtainJwt } from "../../../app/modules/networking/jwt-actions";
import {
  BrowserWallet,
  BrowserWalletConnector,
  BrowserWalletLockedError,
  BrowserWalletMissingError,
} from "../../../app/modules/web3/BrowserWallet";
import { LedgerWallet, LedgerWalletConnector } from "../../../app/modules/web3/LedgerWallet";
import { Web3Adapter } from "../../../app/modules/web3/Web3Adapter";
import { Web3Manager } from "../../../app/modules/web3/Web3Manager";
import { createMount } from "../../createMount";
import { dummyNetworkId } from "../../fixtures";
import {
  createIntegrationTestsSetup,
  waitForTid,
  wrapWithProviders,
} from "../../integrationTestUtils";
import { globalFakeClock } from "../../setupTestsHooks";
import { createMock, tid } from "../../testUtils";

describe("<WalletSelector />", () => {
  it("should render all three wallet tabs", () => {
    const component = shallow(<WalletSelector />);

    expect(component.find(tid("wallet-selector-ledger")).length).to.be.eq(1);
    expect(component.find(tid("wallet-selector-browser")).length).to.be.eq(1);
    expect(component.find(tid("wallet-selector-light")).length).to.be.eq(1);
  });

  describe("integration", () => {
    // @todo: this is rather tmp solution to avoid testing whole obtainJWT flow
    // this should be gone soon and we should write additional mocks to make obtainJWT work
    function selectivelyMockDispatcher(container: Container): void {
      const originalDispatch = container.get<Function>(APP_DISPATCH_SYMBOL);
      const mockDispatch = (action: any) => {
        if (action !== obtainJwt) {
          originalDispatch(action);
        }
      };
      container.rebind(APP_DISPATCH_SYMBOL).toConstantValue(mockDispatch);
    }

    it("should select ledger wallet", async () => {
      const ledgerWalletMock = createMock(LedgerWallet, {});
      const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {});
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: dummyNetworkId,
        internalWeb3Adapter: createMock(Web3Adapter, {
          getBalance: async () => new BigNumber(1),
        }),
        plugPersonalWallet: async () => {},
      });

      const { store, container } = createIntegrationTestsSetup({
        ledgerWalletConnectorMock,
        web3ManagerMock,
      });
      selectivelyMockDispatcher(container);

      const mountedComponent = createMount(
        wrapWithProviders(WalletSelector, {
          container,
          store,
          currentRoute: appRoutes.login,
        }),
      );

      // ensure that ledger tab is selected
      mountedComponent
        .find(tid("wallet-selector-ledger"))
        .find("a")
        .simulate("click", { button: 0 });

      expect(mountedComponent.find(tid("ledger-wallet-error-msg")).text()).to.be.eq(
        "Nano Ledger S not available",
      );

      // simulate successful connection
      ledgerWalletConnectorMock.reMock({
        connect: async () => {},
        testConnection: async () => true,
        getMultipleAccounts: async () => ({
          "44'/60'/0'/1": "0x12345123123",
        }),
        finishConnecting: async () => {
          return ledgerWalletMock;
        },
      });
      globalFakeClock.tick(LEDGER_RECONNECT_INTERVAL);

      await waitForTid(mountedComponent, "wallet-ledger-accounts-table-body");

      // select one of the addresses
      mountedComponent.find(`${tid("account-row")}`).simulate("click");
      await Promise.resolve(); // we need to give async actions time to finish. Is there a better way to do this?

      expect(ledgerWalletConnectorMock.finishConnecting).to.be.calledWithExactly("44'/60'/0'/1");
      expect(web3ManagerMock.plugPersonalWallet).to.be.calledWithExactly(ledgerWalletMock);
    });

    it("should select browser wallet", async () => {
      const browserWalletMock = createMock(BrowserWallet, {});
      const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
        connect: async () => {
          throw new BrowserWalletMissingError();
        },
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: dummyNetworkId,
        internalWeb3Adapter: createMock(Web3Adapter, {
          getBalance: async () => new BigNumber(1),
        }),
        plugPersonalWallet: async () => {},
      });
      const { store, container } = createIntegrationTestsSetup({
        browserWalletConnectorMock,
        web3ManagerMock,
      });
      selectivelyMockDispatcher(container);

      const mountedComponent = createMount(
        wrapWithProviders(WalletSelector, {
          container,
          store,
          currentRoute: appRoutes.login,
        }),
      );

      // select wallet in browser tab is selected
      mountedComponent
        .find(tid("wallet-selector-browser"))
        .find("a")
        .simulate("click", { button: 0 });
      await waitForTid(mountedComponent, "browser-wallet-error-msg");

      // there is no wallet in browser (BrowserWallet thrown BrowserWalletMissingError)
      expect(mountedComponent.find(tid("browser-wallet-error-msg")).text()).to.be.eq(
        "We did not detect any Web3 wallet.",
      );

      // wallet in browser is locked
      browserWalletConnectorMock.reMock({
        connect: async () => {
          throw new BrowserWalletLockedError();
        },
      });
      await globalFakeClock.tickAsync(BROWSER_WALLET_RECONNECT_INTERVAL);
      mountedComponent.update();

      expect(mountedComponent.find(tid("browser-wallet-error-msg")).text()).to.be.eq(
        "Your wallet seems to be locked — we can't access any accounts.",
      );

      // connect doesn't throw which means there is web3 in browser
      browserWalletConnectorMock.reMock({
        connect: async () => browserWalletMock,
      });
      await globalFakeClock.tickAsync(BROWSER_WALLET_RECONNECT_INTERVAL);

      expect(web3ManagerMock.plugPersonalWallet).to.be.calledWithExactly(browserWalletMock);
    });
  });
});
