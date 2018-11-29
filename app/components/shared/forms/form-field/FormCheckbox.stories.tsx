import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./testingUtils";

import { FormCheckbox, FormRadioButton } from "./FormCheckbox";

storiesOf("Form/ Checkbox && RadioButton", module)
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
    "checkbox with long labels",
    formWrapper({ bwm: false, audi: true })(() => (
      <>
        <FormCheckbox
          name="bmw"
          label="Well, sail me cloud, ye stormy furner! Ooh, never blow a son. Aww, avast. Golly gosh! Pieces o' yellow fever are forever big. Arrr there's nothing like the mighty desolation hobbling on the swabbie. Well! Pieces o' beauty are forever black. Clear beauties lead to the amnesty."
        />
        <FormCheckbox
          name="audi"
          label="Well, sail me cloud, ye stormy furner! Ooh, never blow a son. Aww, avast. Golly gosh! Pieces o' yellow fever are forever big. Arrr there's nothing like the mighty desolation hobbling on the swabbie. Well! Pieces o' beauty are forever black. Clear beauties lead to the amnesty."
        />
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
