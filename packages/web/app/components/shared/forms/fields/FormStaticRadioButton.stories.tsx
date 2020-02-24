import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { FormStaticRadioButton } from "./FormStaticRadioButton";

storiesOf("forms/fields/FormStaticRadioButton", module)
  .addDecorator(withFormik)
  .add("default", () => <FormStaticRadioButton value="bla" label="you have no choice" />, {
    formik: {
      initialValues: { name: "foo " },
    },
  });
