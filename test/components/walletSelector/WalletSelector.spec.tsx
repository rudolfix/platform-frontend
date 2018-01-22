import { BigNumber } from "bignumber.js";
import { expect } from "chai";
import * as React from "react";
import { Provider } from "react-redux";
// tslint:disable-next-line
import { MuiThemeProvider } from "material-ui/styles";

import { LEDGER_RECONNECT_INTERVAL } from "../../../app/components/walletSelector/WalletLedgerInitComponent";
import { WalletSelector } from "../../../app/components/walletSelector/WalletSelector";
import { LedgerWallet } from "../../../app/modules/web3/LedgerWallet";
import { Web3Adapter } from "../../../app/modules/web3/Web3Adapter";
import { Web3Manager } from "../../../app/modules/web3/Web3Manager";
import { createMount } from "../../createMount";
import { createIntegrationTestsSetup, waitForTid } from "../../integrationTestUtils";
import { globalFakeClock } from "../../setupTestsHooks";
import { createMock, tid } from "../../testUtils";

describe("<WalletSelector />", () => {
  describe("integration", () => {
    it("should select ledger wallet", async () => {
      const ledgerWalletMock = createMock(LedgerWallet, {});
      const web3Manager = createMock(Web3Manager, {
        networkId: "5",
        internalWeb3Adapter: createMock(Web3Adapter, {
          getBalance: async () => new BigNumber(1),
        }),
        plugPersonalWallet: async () => {},
      });
      const { store } = createIntegrationTestsSetup({ ledgerWalletMock, web3Manager });

      const mountedComponent = createMount(
        <MuiThemeProvider>
          <Provider store={store}>
            <WalletSelector />
          </Provider>
        </MuiThemeProvider>,
      );

      // ensure that ledger is selected
      // for now it's mocked so dont do anything
      // clickFirstTid(mountedComponent, "wallet-selector-ledger");

      expect(mountedComponent.find(tid("ledger-wallet-error-msg")).text()).to.be.eq(
        "Nano Ledger S not available",
      );

      // simulate successful connection
      ledgerWalletMock.reMock({
        connect: async () => {},
        testConnection: async () => true,
        getMultipleAccounts: async () => ({
          "44'/60'/0'/1": "0x12345123123",
        }),
        setDerivationPath: async () => ({}),
      });
      globalFakeClock.tick(LEDGER_RECONNECT_INTERVAL);

      await waitForTid(mountedComponent, "wallet-ledger-accounts-table-body");

      // select one of the addresses
      mountedComponent.find(`${tid("wallet-ledger-accounts-table-body")} > tr`).simulate("click");

      expect(ledgerWalletMock.setDerivationPath).to.be.calledWithExactly("44'/60'/0'/1");
      expect(web3Manager.plugPersonalWallet).to.be.calledWithExactly(ledgerWalletMock);
    });
  });
});
