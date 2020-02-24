import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { FormFieldDate } from "./FormFieldDate";

storiesOf("forms/fields/FieldDate", module)
  .addDecorator(withFormik)
  .add("default", () => <FormFieldDate label="Date of birth" name="dob" />, {
    formik: {
      initialValues: {},
    },
  });
