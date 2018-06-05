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
      <FormCheckbox
        checked={true}
        name="fancy checkbox"
        type="checkbox"
        value="test"
        label="checkbox's label"
      />
    )),
  )
  .add(
    "checkbox group",
    formWrapper({})((form: any) => (
      <>
        <FormCheckbox checked={form.bmw} name="bmw" type="checkbox" label="bmw" />
        <FormCheckbox checked={form.audi} name="audi" type="checkbox" label="audi" />
        <FormCheckbox checked={form.ford} name="ford" type="checkbox" label="ford" />
        <FormCheckbox checked={form.volvo} name="volvo" type="checkbox" label="volvo" />
      </>
    )),
  )
  .add(
    "radio buttons group",
    formWrapper({
      car: "bmw",
    })((form: any) => (
      <>
        <FormCheckbox checked={form.bmw} name="car" type="radio" value="bmw" label="bmw" />
        <FormCheckbox checked={form.audi} name="car" type="radio" value="audi" label="audi" />
        <FormCheckbox checked={form.ford} name="car" type="radio" value="ford" label="ford" />
        <FormCheckbox checked={form.volvo} name="car" type="radio" value="volvo" label="volvo" />
      </>
    )),
  );
