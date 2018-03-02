import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { tid } from "../../../test/testUtils";
import { WalletSelectorNavigation } from "./WalletSelectorNavigation";

describe("WalletSelectorNavigation", () => {
  it("should render all three wallet tabs", () => {
    const component = shallow(<WalletSelectorNavigation rootPath="rootPath" />);

    expect(component.find(tid("wallet-selector-ledger")).length).to.be.eq(1);
    expect(component.find(tid("wallet-selector-browser")).length).to.be.eq(1);
    expect(component.find(tid("wallet-selector-light")).length).to.be.eq(1);
  });
});
