import { expect } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { FormInputRaw } from "./FormInputRaw.unsafe";

describe("FormFieldRaw TextInput", () => {
  it("should show value", () => {
    const component = shallow(
      <FormInputRaw
        type="text"
        placeholder="test_placeholder"
        value="test_value"
        onChange={() => {}}
      />,
    );
    expect(
      component
        .render()
        .find("input")
        .val(),
    ).to.contain("test_value");
  });
  it("should show placeholder", () => {
    const component = shallow(
      <FormInputRaw type="text" placeholder="test_placeholder" onChange={() => {}} />,
    );
    expect(
      component
        .render()
        .find("input")
        .attr("placeholder"),
    ).to.contain("test_placeholder");
  });
  it("should run customOnFocus if it's provided", () => {
    const customFocusSpy = spy();
    const focusSpy = spy();
    const input = mount(
      <FormInputRaw
        type="text"
        customOnFocus={customFocusSpy}
        onFocus={focusSpy}
        onChange={() => {}}
      />,
    ).find("input");
    input.simulate("focus");

    expect(customFocusSpy).to.have.been.called;
    expect(focusSpy).to.not.have.been.called;
  });
  it("should run onFocus if customOnFocus is not provided", () => {
    const focusSpy = spy();
    const input = mount(<FormInputRaw type="text" onFocus={focusSpy} onChange={() => {}} />).find(
      "input",
    );
    input.simulate("focus");

    expect(focusSpy).to.have.been.called;
  });
});
