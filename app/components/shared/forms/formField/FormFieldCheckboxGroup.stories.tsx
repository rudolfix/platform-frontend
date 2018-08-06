import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";
import { formWrapper } from "./form-utils";

import { FormFieldCheckbox, FormFieldCheckboxGroup } from "./FormFieldCheckboxGroup";

storiesOf("FormFieldCheckboxGroup", module).add(
  "default",
  formWrapper({ animals: ["dog"] })(() => (
    <FormFieldCheckboxGroup name="animals">
      <h1>Checkbox group</h1>
      <FormFieldCheckbox value="dog" label="Dog" />
      <FormFieldCheckbox value="cat" label="Cat" />
    </FormFieldCheckboxGroup>
  )),
);