import { expect } from "chai";
import { shallow } from "enzyme";
import { noop } from "lodash";
import * as React from "react";

import { tid } from "../../../test/testUtils";
import { ArrowButton, ArrowLink } from "./ArrowNavigation";

describe("<ArrowButton />", () => {
  it("should render child", () => {
    const testChild = "testHeader";

    const component = shallow(
      <ArrowButton arrowDirection="left" onClick={noop}>
        {testChild}
      </ArrowButton>,
    );

    expect(component.contains(testChild)).to.be.true;
  });

  it("should render right arrow", () => {
    const testChild = "testHeader";

    const component = shallow(
      <ArrowButton arrowDirection="left" onClick={noop}>
        {testChild}
      </ArrowButton>,
    );

    expect(component.find(tid("ArrowLink-arrow-left"))).to.have.length(1);
    expect(component.find(tid("ArrowLink-arrow-right"))).to.have.length(0);
  });

  it("should render left arrow", () => {
    const testChild = "testHeader";

    const component = shallow(
      <ArrowButton arrowDirection="right" onClick={noop}>
        {testChild}
      </ArrowButton>,
    );

    expect(component.find(tid("ArrowLink-arrow-left"))).to.have.length(0);
    expect(component.find(tid("ArrowLink-arrow-right"))).to.have.length(1);
  });
});

describe("<ArrowLink />", () => {
  it("should render child", () => {
    const testChild = "testHeader";

    const component = shallow(
      <ArrowLink arrowDirection="left" to="#">
        {testChild}
      </ArrowLink>,
    );

    expect(component.contains(testChild)).to.be.true;
  });

  it("should render right arrow", () => {
    const testChild = "testHeader";

    const component = shallow(
      <ArrowLink arrowDirection="left" to="#">
        {testChild}
      </ArrowLink>,
    );

    expect(component.find(tid("ArrowLink-arrow-left"))).to.have.length(1);
    expect(component.find(tid("ArrowLink-arrow-right"))).to.have.length(0);
  });

  it("should render left arrow", () => {
    const testChild = "testHeader";

    const component = shallow(
      <ArrowLink arrowDirection="right" to="#">
        {testChild}
      </ArrowLink>,
    );

    expect(component.find(tid("ArrowLink-arrow-left"))).to.have.length(0);
    expect(component.find(tid("ArrowLink-arrow-right"))).to.have.length(1);
  });
});
