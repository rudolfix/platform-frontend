import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { LoadingIndicator } from "../../../app/components/LoadingIndicator";
import {
  AccountRow,
  WalletLedgerChooserComponent,
} from "../../../app/components/walletSelector/WalletLedgerChooserComponent";

describe("<WalletLedgerChooserComponent />", () => {
  const defaultProps = {
    loading: false,
    accounts: [
      {
        address: "0x6C1086C292a7E1FdF66C68776eA972038467A370",
        derivationPath: "44'/60'/0'/0",
        balance: "1.6495ETH",
      },
      {
        address: "0xB2A0e2688c5A82bEEe6818F5a3D206680FdFD75d",
        derivationPath: "44'/60'/0'/1",
        balance: "0",
      },
      {
        address: "0xa13D14DA39529761a6C45F4f556700735E0774a8",
        derivationPath: "44'/60'/0'/2",
        balance: "0",
      },
      {
        address: "0x3cC2ef578f6Eb7ff63f9CA8f5a54cfe40339256A",
        derivationPath: "44'/60'/0'/3",
        balance: "1.6495ETH",
      },
    ],
    handleAddressChosen: spy(),
    hasPreviousAddress: true,
    showPrevAddresses: spy(),
    showNextAddresses: spy(),
    derivationPath: "44'/60'/0'/0",
    onDerivationPathChange: spy(),
    invalidDerivationPath: false,
  };

  it("should render LoadingIndicator for loading attribute", () => {
    const props = {
      ...defaultProps,
      loading: true,
    };
    const component = shallow(<WalletLedgerChooserComponent {...props} />);

    expect(component.contains(<LoadingIndicator />)).to.be.true;
  });

  it("should render all provided accounts", () => {
    const component = shallow(<WalletLedgerChooserComponent {...defaultProps} />);
    expect(component.find(AccountRow).length).to.be.eq(defaultProps.accounts.length);
  });

  it("should show correct prev / next buttons regarding hasPreviousAddress property ", () => {
    const componentWithPrevAddr = shallow(<WalletLedgerChooserComponent {...defaultProps} />);

    const props = {
      ...defaultProps,
      hasPreviousAddress: false,
    };
    const componentWithoutPrevAddr = shallow(<WalletLedgerChooserComponent {...props} />);

    expect(componentWithPrevAddr.find({ "data-test-id": "btn-previous" }).length).to.be.eq(1);
    expect(componentWithPrevAddr.find({ "data-test-id": "btn-next" }).length).to.be.eq(1);

    expect(componentWithoutPrevAddr.find({ "data-test-id": "btn-previous" }).length).to.be.eq(0);
    expect(componentWithoutPrevAddr.find({ "data-test-id": "btn-next" }).length).to.be.eq(1);
  });

  it("should call correct click handlers for prev / next buttons", () => {
    const component = shallow(<WalletLedgerChooserComponent {...defaultProps} />);

    component.find({ "data-test-id": "btn-previous" }).simulate("click");
    component.find({ "data-test-id": "btn-next" }).simulate("click");
    expect(defaultProps.showPrevAddresses).to.be.calledOnce;
    expect(defaultProps.showNextAddresses).to.be.calledOnce;
  });

  it("<AccountRow /> should render correct account data and handle click ", () => {
    const account = defaultProps.accounts[0];
    const accountRow = shallow(
      <AccountRow ledgerAccount={account} handleAddressChosen={defaultProps.handleAddressChosen} />,
    );

    const renderedDerivationPath = accountRow.find({ "data-test-id": "account-derivation-path" });
    expect(renderedDerivationPath.text()).to.be.eq(account.derivationPath);
    const renderedAddress = accountRow.find({ "data-test-id": "account-address" });
    expect(renderedAddress.text()).to.be.eq(account.address);
    const renderedBalance = accountRow.find({ "data-test-id": "account-balance" });
    expect(renderedBalance.text()).to.be.eq(account.balance);

    accountRow.find({ "data-test-id": "account-row" }).simulate("click");
    expect(defaultProps.handleAddressChosen).to.be.calledOnce;
  });
});
