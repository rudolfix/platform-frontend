import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./form-utils";

import { FormCheckbox } from "./FormCheckbox";

storiesOf("FormCheckbox", module)
  .add(
    "checkbox checked",
    formWrapper({
      "fancy checkbox": true,
    })(() => (
      <FormCheckbox name="fancy checkbox" type="checkbox" value="test" label="checkbox's label" />
    )),
  )
  .add(
    "checkbox group",
    formWrapper({ bwm: true, ford: true })((form: any) => (
      <>
        <FormCheckbox name="bmw" type="checkbox" label="bmw" />
        <FormCheckbox name="audi" type="checkbox" label="audi" />
        <FormCheckbox name="ford" type="checkbox" label="ford" />
        <FormCheckbox name="volvo" type="checkbox" label="volvo" />
      </>
    )),
  )
  .add(
    "radio buttons group",
    formWrapper({
      car: "audi",
    })((form: any) => (
      <>
        <FormCheckbox name="car" type="radio" value="bmw" label="bmw" />
        <FormCheckbox name="car" type="radio" value="audi" label="audi" />
        <FormCheckbox name="car" type="radio" value="ford" label="ford" />
        <FormCheckbox name="car" type="radio" value="volvo" label="volvo" />
      </>
    )),
  );
