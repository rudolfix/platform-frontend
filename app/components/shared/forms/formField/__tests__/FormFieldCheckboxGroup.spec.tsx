import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { clickFirstTid } from "../../../../../../test/integrationTestUtils";
import { tid } from "../../../../../../test/testUtils";
import { formWrapper } from "../form-utils";
import { FormFieldCheckbox, FormFieldCheckboxGroup } from "../FormFieldCheckboxGroup";

describe("FormFieldCheckboxGroup", () => {
  it("should work", () => {
    const submitFormHandler = spy();

    const Component = formWrapper({}, submitFormHandler)(() => (
      <FormFieldCheckboxGroup name="checkboxes">
        <FormFieldCheckbox label="A" value="a" data-test-id="a" />
        <FormFieldCheckbox label="B" value="b" data-test-id="b" />
      </FormFieldCheckboxGroup>
    ));
    const component = mount(<Component />);

    const trigger = (id: string, value: boolean) => {
      component
        .find(tid(id))
        .last()
        .simulate("change", { target: { checked: value } });
      clickFirstTid(component, "test-form-submit");
    };

    trigger("a", true);
    expect(submitFormHandler).to.be.calledOnce;
    expect(submitFormHandler).to.be.calledWith({ checkboxes: ["a"] });

    trigger("b", true);
    expect(submitFormHandler).to.be.calledTwice;
    expect(submitFormHandler).to.be.calledWith({ checkboxes: ["a", "b"] });

    trigger("a", true);
    expect(submitFormHandler).to.be.calledThrice;
    expect(submitFormHandler).to.be.calledWith({ checkboxes: ["b"] });
  });

  it("should set default value", () => {
    const submitFormHandler = spy();

    const Component = formWrapper({}, submitFormHandler)(() => (
      <FormFieldCheckboxGroup name="checkboxes">
        <FormFieldCheckbox label="A" value="a" data-test-id="a" />
        <FormFieldCheckbox label="B" value="b" data-test-id="b" />
      </FormFieldCheckboxGroup>
    ));
    const component = mount(<Component />);

    clickFirstTid(component, "test-form-submit");

    expect(submitFormHandler).to.be.calledOnce;
    expect(submitFormHandler).to.be.calledWith({ checkboxes: [] });
  });
});
