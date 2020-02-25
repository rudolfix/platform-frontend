import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { FormFieldColorful } from "./FormFieldColorful";

storiesOf("forms/fields/FormFieldColorful", module)
  .addDecorator(withFormik)
  .add("default", () => <FormFieldColorful placeholder="Form field colorful" name="value" />, {
    formik: {
      initialValues: {},
    },
  })
  .add(
    "with Avatar",
    () => <FormFieldColorful placeholder="Form field colorful" name="value" showAvatar={true} />,
    {
      formik: {
        initialValues: { value: "Lorem ipsum" },
      },
    },
  );
