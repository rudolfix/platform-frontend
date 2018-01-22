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

const defaultProps = () => ({
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
});

describe("<WalletLedgerChooserComponent />", () => {
  it("should render LoadingIndicator for loading attribute", () => {
    const props = {
      ...defaultProps(),
      loading: true,
    };
    const component = shallow(<WalletLedgerChooserComponent {...props} />);

    expect(component.contains(<LoadingIndicator />)).to.be.true;
  });

  it("should render all provided accounts", () => {
    const props = defaultProps();
    const component = shallow(<WalletLedgerChooserComponent {...props} />);
    expect(component.find(AccountRow).length).to.be.eq(props.accounts.length);
  });

  it("should show / hide previous address button regarding hasPreviousAddress property", () => {
    const propsWithPrevAddr = defaultProps();
    const componentWithPrevAddr = shallow(<WalletLedgerChooserComponent {...propsWithPrevAddr} />);
    const propsWithoutPrevAddr = {
      ...defaultProps(),
      hasPreviousAddress: false,
    };
    const componentWithoutPrevAddr = shallow(<WalletLedgerChooserComponent {...propsWithoutPrevAddr} />);
    expect(componentWithPrevAddr.find(tid("btn-previous")).length).to.be.eq(1);
    expect(componentWithoutPrevAddr.find(tid("btn-previous")).length).to.be.eq(0);
  });

  it("should call correct click handlers for prev button", () => {
    const props = defaultProps();
    const component = shallow(<WalletLedgerChooserComponent {...props} />);
    component.find(tid("btn-previous")).simulate("click");
    expect(props.showPrevAddresses).to.be.calledOnce;
  });

  it("should call correct click handlers for next button", () => {
    const props = defaultProps();
    const component = shallow(<WalletLedgerChooserComponent {...props} />);
    component.find(tid("btn-next")).simulate("click");
    expect(props.showNextAddresses).to.be.calledOnce;
  });
});

describe("<AccountRow />", () => {
  it("should render correct account data and handle click", () => {
    const props = defaultProps();
    const account = props.accounts[0];
    const accountRow = shallow(
      <AccountRow ledgerAccount={account} handleAddressChosen={props.handleAddressChosen} />,
    );

    const renderedDerivationPath = accountRow.find(tid("account-derivation-path"));
    expect(renderedDerivationPath.text()).to.be.eq(account.derivationPath);
    const renderedAddress = accountRow.find(tid("account-address"));
    expect(renderedAddress.text()).to.be.eq(account.address);
    const renderedBalance = accountRow.find(tid("account-balance"));
    expect(renderedBalance.text()).to.be.eq(account.balance);

    accountRow.find(tid("account-row")).simulate("click");
    expect(props.handleAddressChosen).to.be.calledOnce;
  });
});
