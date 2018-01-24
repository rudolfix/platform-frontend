import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { LoadingIndicator } from "../../../app/components/LoadingIndicator";
import { WalletBrowserComponent } from "../../../app/components/walletSelector/WalletBrowser";
import { tid } from "../../testUtils";

describe("<WalletBrowser />", () => {
  it("should render LoadingIndicator", () => {
    const component = shallow(<WalletBrowserComponent />);
    expect(component.find(LoadingIndicator)).to.have.length(1);
  });

  it("should render error message", () => {
    const errorMsg = "some error";
    const component = shallow(<WalletBrowserComponent errorMessage={errorMsg} />);
    expect(component.find(tid("browser-wallet-error-msg")).text()).to.be.eq(errorMsg);
  });
});
