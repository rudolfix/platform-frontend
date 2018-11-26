import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { WalletMessageSigner } from "./WalletMessageSigner";
import { WalletSelectorComponent } from "./WalletSelector";

describe("<WalletSelector />", () => {
  it("should render message signing", () => {
    const component = shallow(
      <WalletSelectorComponent
        isMessageSigning={true}
        rootPath="rootPath"
        oppositeRoute="oppositeRoute"
        userType="investor"
        isLoginRoute
        openICBMModal={() => {}}
      />,
    );

    expect(component.contains(<WalletMessageSigner rootPath="rootPath" />)).to.be.true;
  });
});
