import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { tid } from "../../test/testUtils";
import { Home } from "./Home";

describe("<Home />", () => {
  it("should render", () => {
    const component = shallow(<Home />);

    expect(component.find(tid("homepage-title")).text()).to.be.eq("Home");
  });
});
