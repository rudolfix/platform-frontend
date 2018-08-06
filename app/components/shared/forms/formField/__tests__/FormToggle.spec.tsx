import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { spy } from "sinon";
import { clickFirstTid } from "../../../../../../test/integrationTestUtils";
import { tid } from "../../../../../../test/testUtils";
import { formWrapper } from "../form-utils";
import { FormToggle } from "../FormToggle";

describe("Toggle", () => {
  const TRUE_VALUE = "TRUE VALUE";
  const FALSE_VALUE = "FALSE VALUE";

  it("should toggle true value", () => {
    const submitFormHandler = spy();

    const Component = formWrapper({ toggle: TRUE_VALUE }, submitFormHandler)(() => (
      <FormToggle
        name="toggle"
        enabledLabel="on"
        disabledLabel="off"
        trueValue={TRUE_VALUE}
        falseValue={FALSE_VALUE}
        data-test-id="component"
      />
    ));
    const component = mount(<Component />);

    component
      .find(tid("component"))
      .last()
      .simulate("change", { target: { checked: false } });

    clickFirstTid(component, "test-form-submit");

    expect(submitFormHandler).to.be.calledOnce;
    expect(submitFormHandler).to.be.calledWith({ toggle: FALSE_VALUE });
  });

  it("should toggle false value", () => {
    const submitFormHandler = spy();

    const Component = formWrapper({ toggle: FALSE_VALUE }, submitFormHandler)(() => (
      <FormToggle
        name="toggle"
        enabledLabel="on"
        disabledLabel="off"
        trueValue={TRUE_VALUE}
        falseValue={FALSE_VALUE}
        data-test-id="component"
      />
    ));
    const component = mount(<Component />);

    component
      .find(tid("component"))
      .last()
      .simulate("change", { target: { checked: true } });

    clickFirstTid(component, "test-form-submit");

    expect(submitFormHandler).to.be.calledOnce;
    expect(submitFormHandler).to.be.calledWith({ toggle: TRUE_VALUE });
  });

  it("should set default value", () => {
    const submitFormHandler = spy();

    const Component = formWrapper({}, submitFormHandler)(() => (
      <FormToggle
        name="toggle"
        enabledLabel="on"
        disabledLabel="off"
        trueValue={TRUE_VALUE}
        falseValue={FALSE_VALUE}
        data-test-id="component"
      />
    ));
    const component = mount(<Component />);

    clickFirstTid(component, "test-form-submit");

    expect(submitFormHandler).to.be.calledOnce;
    expect(submitFormHandler).to.be.calledWith({ toggle: FALSE_VALUE });
  });
});
