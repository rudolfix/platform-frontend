import { storiesOf } from "@storybook/react";
import * as React from "react";

import { FormToggle } from "./FormToggle";
import { formWrapper } from "./testingUtils";

storiesOf("Form/Toggle", module)
  .add(
    "on",
    formWrapper({ toggle: true })(() => (
      <FormToggle
        name="toggle"
        enabledLabel="on"
        disabledLabel="off"
        trueValue="TRUE VALUE"
        falseValue="FALSE VAL"
      />
    )),
  )
  .add(
    "off",
    formWrapper({ toggle: false })(() => (
      <FormToggle name="toggle" enabledLabel="on" disabledLabel="off" />
    )),
  )
  .add(
    "disabled on",
    formWrapper({ toggle: true })(() => (
      <FormToggle name="toggle" enabledLabel="on" disabledLabel="off" disabled />
    )),
  )
  .add(
    "disabled off",
    formWrapper({ toggle: false })(() => (
      <FormToggle name="toggle" enabledLabel="on" disabledLabel="off" disabled />
    )),
  );
