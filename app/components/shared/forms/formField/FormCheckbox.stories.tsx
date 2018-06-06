import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./form-utils";

import { FormCheckbox, FormRadioButton } from "./FormCheckbox";

storiesOf("FormCheckbox && FormRadioButton", module)
  .add(
    "checkbox",
    formWrapper({ bwm: false, audi: false, ford: true, volvo: true })(() => (
      <>
        <FormCheckbox name="bmw" label="bmw" />
        <FormCheckbox name="audi" label="audi" />
        <FormCheckbox name="ford" label="ford" />
        <FormCheckbox name="volvo" label="volvo" />
      </>
    )),
  )
  .add(
    "radio button",
    formWrapper({ car: "bmw" })(() => (
      <>
        <FormRadioButton name="car" value="bmw" label="bmw" />
        <FormRadioButton name="car" value="audi" label="audi" />
        <FormRadioButton name="car" value="ford" label="ford" />
        <FormRadioButton name="car" value="volvo" label="volvo" />
      </>
    )),
  );
