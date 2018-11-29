import { storiesOf } from "@storybook/react";
import * as React from "react";

import { FormConstantField } from "./FormConstantField";
import { formWrapper } from "./testingUtils";

storiesOf("Form/ConstantField", module).add(
  "default",
  formWrapper({ car: "bmw" })(() => <FormConstantField value="test" />),
);
