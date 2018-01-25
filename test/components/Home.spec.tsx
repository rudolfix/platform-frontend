import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { Home } from "../../app/components/Home";
import { tid } from "../testUtils";

describe("<Home />", () => {
  it("should render", () => {
    const component = shallow(<Home />);

    expect(component.find(tid("homepage-title")).text()).to.be.eq("Home");
  });
});
