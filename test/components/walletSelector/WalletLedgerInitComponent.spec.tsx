import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { Alert } from "reactstrap";

import { LoadingIndicator } from "../../../app/components/LoadingIndicator";
import { WalletLedgerInitComponent } from "../../../app/components/walletSelector/WalletLedgerInitComponent";

describe("<WalletLedgerInitComponent />", () => {
  it("should render LoadingIndicator", () => {
    const component = shallow(<WalletLedgerInitComponent />);
    expect(component.find(LoadingIndicator)).to.have.length(1);
  });

  it("should render error message", () => {
    const errorMsg = "some error";
    const component = shallow(<WalletLedgerInitComponent errorMessage={errorMsg} />);
    expect(
      component.contains(
        <Alert color="info">
          <h4>Connection status:</h4>
          <p>{errorMsg}</p>
        </Alert>,
      ),
    ).to.be.true;
  });
});
