import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { LoadingIndicator } from "../../../app/components/LoadingIndicator";
import {
  AccountRow,
  WalletLedgerChooserComponent,
} from "../../../app/components/walletSelector/WalletLedgerChooserComponent";
import { tid } from "../../testUtils";

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

describe("<WalletLedgerChooserComponent />", () => {
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

  it("should show correct prev / next buttons regarding hasPreviousAddress property", () => {
    const componentWithPrevAddr = shallow(<WalletLedgerChooserComponent {...defaultProps} />);

    const props = {
      ...defaultProps,
      hasPreviousAddress: false,
    };
    const componentWithoutPrevAddr = shallow(<WalletLedgerChooserComponent {...props} />);

    expect(componentWithPrevAddr.find(tid("btn-previous")).length).to.be.eq(1);
    expect(componentWithPrevAddr.find(tid("btn-next")).length).to.be.eq(1);

    expect(componentWithoutPrevAddr.find(tid("btn-previous")).length).to.be.eq(0);
    expect(componentWithoutPrevAddr.find(tid("btn-next")).length).to.be.eq(1);
  });

  it("should call correct click handlers for prev / next buttons", () => {
    const component = shallow(<WalletLedgerChooserComponent {...defaultProps} />);

    component.find(tid("btn-previous")).simulate("click");
    component.find(tid("btn-next")).simulate("click");
    expect(defaultProps.showPrevAddresses).to.be.calledOnce;
    expect(defaultProps.showNextAddresses).to.be.calledOnce;
  });
});

describe("<AccountRow />", () => {
  it("should render correct account data and handle click", () => {
    const account = defaultProps.accounts[0];
    const accountRow = shallow(
      <AccountRow ledgerAccount={account} handleAddressChosen={defaultProps.handleAddressChosen} />,
    );

    const renderedDerivationPath = accountRow.find(tid("account-derivation-path"));
    expect(renderedDerivationPath.text()).to.be.eq(account.derivationPath);
    const renderedAddress = accountRow.find(tid("account-address"));
    expect(renderedAddress.text()).to.be.eq(account.address);
    const renderedBalance = accountRow.find(tid("account-balance"));
    expect(renderedBalance.text()).to.be.eq(account.balance);

    accountRow.find(tid("account-row")).simulate("click");
    expect(defaultProps.handleAddressChosen).to.be.calledOnce;
  });
});
