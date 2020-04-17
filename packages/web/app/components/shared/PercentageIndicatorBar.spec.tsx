import { tid } from "@neufund/shared-utils/tests";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { PercentageIndicatorBar } from "./PercentageIndicatorBar";

describe("<PercentageIndicatorBar />", () => {
  it("should round percent value", () => {
    const component = shallow(<PercentageIndicatorBar percent={23.4} />);

    expect(component.find(tid("percentage-indicator-bar-value")).text()).to.be.eq("23%");
  });
});
