import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { FormSelectField } from "./FormSelectField";

const defaultValues = {
  foo: "Foo",
  bar: "Bar",
};

storiesOf("forms/fields/SelectField", module)
  .addDecorator(withFormik)
  .add("default", () => <FormSelectField name="name" values={defaultValues} />, {
    formik: {
      initialValues: { name: "foo " },
    },
  })
  .add("disabled", () => <FormSelectField name="name" values={defaultValues} disabled={true} />, {
    formik: {
      initialValues: { name: "foo " },
    },
  })
  .add(
    "with custom options",
    () => (
      <FormSelectField
        name="name"
        customOptions={[0, 0.5, 1, 1.5].map(n => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      />
    ),
    {
      formik: {
        initialValues: { name: 1.5 },
      },
    },
  );
