import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { formWrapper } from "./form-utils";
import { FormConstantField } from "./FormConstantField";

storiesOf("FormConstantField", module).add(
  "default",
  formWrapper({ car: "bmw" })(() => <FormConstantField value="test" />),
);
