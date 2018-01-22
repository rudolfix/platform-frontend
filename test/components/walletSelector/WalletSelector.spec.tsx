import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { WalletBrowser } from "../../../app/components/walletSelector/WalletBrowser";
import { WalletLedger } from "../../../app/components/walletSelector/WalletLedger";
import { WalletLight } from "../../../app/components/walletSelector/WalletLight";
import { WalletSelectorComponent } from "../../../app/components/walletSelector/WalletSelector";
import { tid } from "../../testUtils";

const defaultProps = {
  walletInBrowserSelectedAction: spy(),
  ledgerWalletSelectedAction: spy(),
  lightWalletSelectedAction: spy(),
  walletInBrowserSelected: true,
  ledgerWalletSelected: false,
  lightWalletSelected: false,
};

describe("<WalletSelector />", () => {
  it("should render all three wallet tabs", () => {
    const component = shallow(<WalletSelectorComponent {...defaultProps} />);

    expect(component.find(tid("wallet-selector-ledger")).length).to.be.eq(1);
    expect(component.find(tid("wallet-selector-browser")).length).to.be.eq(1);
    expect(component.find(tid("wallet-selector-light")).length).to.be.eq(1);
  });

  it("should fire correct actions for selected wallets", () => {
    const walletInBrowserSelected = shallow(<WalletSelectorComponent {...defaultProps} />);
    walletInBrowserSelected.find(tid("wallet-selector-browser")).simulate("select");

    const propsLedger = {
      ...defaultProps,
      walletInBrowserSelected: false,
      ledgerWalletSelected: true,
    };
    const ledgerSelected = shallow(<WalletSelectorComponent {...propsLedger} />);
    ledgerSelected.find(tid("wallet-selector-ledger")).simulate("select");

    const propsLightWallet = {
      ...defaultProps,
      walletInBrowserSelected: false,
      lightWalletSelected: true,
    };
    const lightWalletSelected = shallow(<WalletSelectorComponent {...propsLightWallet} />);
    lightWalletSelected.find(tid("wallet-selector-light")).simulate("select");

    expect(defaultProps.walletInBrowserSelectedAction).to.be.calledOnce;
    expect(defaultProps.ledgerWalletSelectedAction).to.be.calledOnce;
    expect(defaultProps.lightWalletSelectedAction).to.be.calledOnce;
  });

  it("should render correct wallets details for selected tab", () => {
    const walletInBrowserSelected = shallow(<WalletSelectorComponent {...defaultProps} />);
    expect(walletInBrowserSelected.find(WalletBrowser).length).to.be.eq(1);

    const propsLedger = {
      ...defaultProps,
      walletInBrowserSelected: false,
      ledgerWalletSelected: true,
    };
    const ledgerSelected = shallow(<WalletSelectorComponent {...propsLedger} />);
    expect(ledgerSelected.find(WalletLedger).length).to.be.eq(1);

    const propsLightWallet = {
      ...defaultProps,
      walletInBrowserSelected: false,
      lightWalletSelected: true,
    };
    const lightWalletSelected = shallow(<WalletSelectorComponent {...propsLightWallet} />);
    expect(lightWalletSelected.find(WalletLight).length).to.be.eq(1);
  });
});
