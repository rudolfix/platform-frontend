import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./form-utils";
import { FormCategoryDistribution } from "./FormCategoryDistribution";

storiesOf("FormCategoryDistribution", module).add(
  "checkbox",
  formWrapper({ test: [{ name: "", percentage: 0, placeholder: "Product Development" }] })(() => (
    <FormCategoryDistribution label="HOW WILL YOU USE THE RAISED CAPITAL?" name="test" />
  )),
);
