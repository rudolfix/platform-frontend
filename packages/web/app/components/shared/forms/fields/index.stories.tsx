import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { FormField } from "./index";

storiesOf("forms/fields/Field", module)
  .addDecorator(withFormik)
  .add("default", () => <FormField label="Form field" name="value" />, {
    formik: {
      initialValues: {},
    },
  })
  .add("with suffix", () => <FormField label="Form field" name="value" suffix="%" />, {
    formik: {
      initialValues: {},
    },
  })
  .add("with prefix", () => <FormField label="Form field" name="value" prefix="@" />, {
    formik: {
      initialValues: {},
    },
  })
  .add("disabled", () => <FormField label="Form field" name="value" disabled={true} />, {
    formik: {
      initialValues: {},
    },
  });
