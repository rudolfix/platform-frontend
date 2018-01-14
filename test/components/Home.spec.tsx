import * as React from "react";
import { Home } from "../../app/components/Home";
import { shallow } from "enzyme";
import { expect } from "chai";

describe("<Home />", () => {
  it("should render", () => {
    const component = shallow(<Home />);

    expect(component.find("h1").text()).to.be.eq("Hello world!");
  });
});
