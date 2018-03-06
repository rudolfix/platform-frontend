import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { tid } from "../../../test/testUtils";
import { PanelDark } from "./PanelDark";

describe("<PanelDark />", () => {
  it("should render headerText property", () => {
    const textHeader = "testHeader";
    const rightComponent = <div>right component</div>;

    const component = shallow(
      <PanelDark headerText={textHeader} rightComponent={rightComponent} />,
    );

    expect(component.find(tid("panelDark-header-text")).text()).to.be.eq(textHeader);
  });

  it("should render rightComponent property", () => {
    const textHeader = "testHeader";
    const rightComponent = <div>right component</div>;

    const component = shallow(
      <PanelDark headerText={textHeader} rightComponent={rightComponent} />,
    );

    expect(component.contains(rightComponent)).to.be.true;
  });
});
