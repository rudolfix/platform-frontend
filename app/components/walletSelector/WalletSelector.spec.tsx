import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { tid } from "../../../test/testUtils";
import { WalletMessageSigner } from "./WalletMessageSigner";
import { WalletSelectorComponent } from "./WalletSelector";

describe("<WalletSelector />", () => {
  it("should render all three wallet tabs", () => {
    const component = shallow(<WalletSelectorComponent isMessageSigning={false} />);

    expect(component.find(tid("wallet-selector-ledger")).length).to.be.eq(1);
    expect(component.find(tid("wallet-selector-browser")).length).to.be.eq(1);
    expect(component.find(tid("wallet-selector-light")).length).to.be.eq(1);
  });

  it("should render message signing", () => {
    const component = shallow(<WalletSelectorComponent isMessageSigning={true} />);

    expect(component.contains(<WalletMessageSigner />)).to.be.true;
  });
});
