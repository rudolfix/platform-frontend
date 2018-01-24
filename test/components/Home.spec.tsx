import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { Home } from "../../app/components/Home";

describe("<Home />", () => {
  it("should render", () => {
    const component = shallow(<Home />);

    expect(component.find("h1").text()).to.be.eq("Neufund Platform!");
  });
});
