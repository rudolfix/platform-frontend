import { BigNumber } from "bignumber.js";
import { expect } from "chai";
import { shallow } from "enzyme";
// tslint:disable-next-line
import { MuiThemeProvider } from "material-ui/styles";
import * as React from "react";
import { Provider } from "react-redux";
import { spy } from "sinon";

import { WalletBrowser } from "../../../app/components/walletSelector/WalletBrowser";
import { WalletLedger } from "../../../app/components/walletSelector/WalletLedger";
import { LEDGER_RECONNECT_INTERVAL } from "../../../app/components/walletSelector/WalletLedgerInitComponent";
import { WalletLight } from "../../../app/components/walletSelector/WalletLight";
import {
  WalletSelector,
  WalletSelectorComponent,
} from "../../../app/components/walletSelector/WalletSelector";
import { LedgerWallet } from "../../../app/modules/web3/LedgerWallet";
import { Web3Adapter } from "../../../app/modules/web3/Web3Adapter";
import { Web3Manager } from "../../../app/modules/web3/Web3Manager";
import { createMount } from "../../createMount";
import { createIntegrationTestsSetup, waitForTid } from "../../integrationTestUtils";
import { globalFakeClock } from "../../setupTestsHooks";
import { createMock, tid } from "../../testUtils";

const defaultProps = () => ({
  walletInBrowserSelectedAction: spy(),
  ledgerWalletSelectedAction: spy(),
  lightWalletSelectedAction: spy(),
  walletInBrowserSelected: true,
  ledgerWalletSelected: false,
  lightWalletSelected: false,
});

describe("<WalletSelector />", () => {
  it("should render all three wallet tabs", () => {
    const component = shallow(<WalletSelectorComponent {...defaultProps()} />);

    expect(component.find(tid("wallet-selector-ledger")).length).to.be.eq(1);
    expect(component.find(tid("wallet-selector-browser")).length).to.be.eq(1);
    expect(component.find(tid("wallet-selector-light")).length).to.be.eq(1);
  });

  it("should fire correct actions for selected wallets", () => {
    const propsWalletInBrowser = defaultProps();
    const walletInBrowserSelected = shallow(<WalletSelectorComponent {...propsWalletInBrowser} />);
    walletInBrowserSelected.find(tid("wallet-selector-browser")).simulate("select");

    const propsLedger = {
      ...defaultProps(),
      walletInBrowserSelected: false,
      ledgerWalletSelected: true,
    };
    const ledgerSelected = shallow(<WalletSelectorComponent {...propsLedger} />);
    ledgerSelected.find(tid("wallet-selector-ledger")).simulate("select");

    const propsLightWallet = {
      ...defaultProps(),
      walletInBrowserSelected: false,
      lightWalletSelected: true,
    };
    const lightWalletSelected = shallow(<WalletSelectorComponent {...propsLightWallet} />);
    lightWalletSelected.find(tid("wallet-selector-light")).simulate("select");

    expect(propsWalletInBrowser.walletInBrowserSelectedAction).to.be.calledOnce;
    expect(propsLedger.ledgerWalletSelectedAction).to.be.calledOnce;
    expect(propsLightWallet.lightWalletSelectedAction).to.be.calledOnce;
  });

  it("should render correct wallets details for selected tab", () => {
    const propsWalletInBrowser = defaultProps();
    const walletInBrowserSelected = shallow(<WalletSelectorComponent {...propsWalletInBrowser} />);
    expect(walletInBrowserSelected.find(WalletBrowser).length).to.be.eq(1);

    const propsLedger = {
      ...defaultProps(),
      walletInBrowserSelected: false,
      ledgerWalletSelected: true,
    };
    const ledgerSelected = shallow(<WalletSelectorComponent {...propsLedger} />);
    expect(ledgerSelected.find(WalletLedger).length).to.be.eq(1);

    const propsLightWallet = {
      ...defaultProps(),
      walletInBrowserSelected: false,
      lightWalletSelected: true,
    };
    const lightWalletSelected = shallow(<WalletSelectorComponent {...propsLightWallet} />);
    expect(lightWalletSelected.find(WalletLight).length).to.be.eq(1);
  });

  describe("integration", () => {
    it("should select ledger wallet", async () => {
      const ledgerWalletMock = createMock(LedgerWallet, {});
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: "5",
        internalWeb3Adapter: createMock(Web3Adapter, {
          getBalance: async () => new BigNumber(1),
        }),
        plugPersonalWallet: async () => {},
      });
      const { store } = createIntegrationTestsSetup({ ledgerWalletMock, web3ManagerMock });

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
      mountedComponent.find(`${tid("account-row")}`).simulate("click");

      expect(ledgerWalletMock.setDerivationPath).to.be.calledWithExactly("44'/60'/0'/1");
      expect(web3ManagerMock.plugPersonalWallet).to.be.calledWithExactly(ledgerWalletMock);
    });
  });
});
