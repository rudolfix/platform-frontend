import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./form-utils";
import { FormCategoryDistribution } from "./FormCategoryDistribution";

storiesOf("FormCategoryDistribution", module).add(
  "checkbox",
  formWrapper({})(() => (
    <FormCategoryDistribution
      label="HOW WILL YOU USE THE RAISED CAPITAL?"
      name="test"
      paragraphName="paragraph"
      suggestions={["test1", "test2", "test3"]}
    />
  )),
);
