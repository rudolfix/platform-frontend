import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { tid } from "../../../test/testUtils";
import { WalletLedgerInitComponent } from "./WalletLedgerInitComponent";

describe("<WalletLedgerInitComponent />", () => {
  it("should render error message", () => {
    const errorMsg = "some error";
    const component = shallow(
      <WalletLedgerInitComponent
        errorMessage={errorMsg}
        isLoginRoute
        isInitialConnectionInProgress={false}
      />,
    );
    expect(component.find(tid("ledger-wallet-error-msg")).text()).to.be.eq(errorMsg);
  });
});
