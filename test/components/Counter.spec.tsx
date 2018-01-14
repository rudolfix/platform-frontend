import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { CounterSFC } from "../../app/components/Counter";
import { spy } from "sinon";
import { tid } from "../testUtils";

describe("<Counter />", () => {
  it("should render", () => {
    const props = {
      value: 5,
      countUp: spy(),
      countDown: spy(),
      countAsync: spy(),
    };

    const component = shallow(<CounterSFC {...props} />);

    expect(component.find("h2").text()).to.be.eq("5");
  });

  it("should issue action on + click", () => {
    const props = {
      value: 5,
      countUp: spy(),
      countDown: spy(),
      countAsync: spy(),
    };

    const component = shallow(<CounterSFC {...props} />);
    component.find(tid("btn-plus")).simulate("click");

    expect(props.countUp).to.be.calledOnce;
    expect(props.countDown).to.be.not.be.called;
    expect(props.countAsync).to.be.not.be.called;
  });
});
