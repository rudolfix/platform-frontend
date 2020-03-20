import { tid } from "@neufund/shared/tests";
import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { object, string } from "yup";

import { wrapWithIntl } from "../../../../../test/integrationTestUtils.unsafe";
import { FormFieldLabel } from "./FormFieldLabel";
import { formWrapper } from "./testingUtils.unsafe";

describe.skip("FormFieldLabel", () => {
  it("should mark field as optional when not required", async () => {
    const Component = formWrapper({
      formState: { foo: "bar" },
      validationSchema: object({ foo: string() }),
    })(() => <FormFieldLabel name="foo">Foo</FormFieldLabel>);

    const component = mount(wrapWithIntl(<Component />));

    expect(component.exists(tid("forms.fields.form-field-label.optional"))).to.be.true;
  });

  it("should not mark field as optional when required", async () => {
    const Component = formWrapper({
      formState: { foo: "bar" },
      validationSchema: object({ foo: string().required() }),
    })(() => <FormFieldLabel name="foo">Foo</FormFieldLabel>);

    const component = mount(wrapWithIntl(<Component />));

    expect(component.exists(tid("forms.fields.form-field-label.optional"))).to.be.false;
  });
});
