import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { LoadingIndicator } from "../../../app/components/LoadingIndicator";
import { WalletLedgerChooserComponent } from "../../../app/components/walletSelector/WalletLedgerChooserComponent";

describe.only("<WalletLedgerChooserComponent />", () => {

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
    handleAddressChosen: () => () => {
      alert("address clicked");
    },
    hasPreviousAddress: true,
    showPrevAddresses: () => {
      alert("prev address clicked");
    },
    showNextAddresses: () => {
      alert("next address clicked");
    },
    derivationPath: "44'/60'/0'/0",
    onDerivationPathChange: () => {
      alert("derivation path changed");
    },
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
});
