import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

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
});
