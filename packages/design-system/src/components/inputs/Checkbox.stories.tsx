import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { PaddedWrapper } from "../../storybook-decorators";
import { Checkbox } from "./Checkbox";
import CheckboxReadme from "./Checkbox.md";

storiesOf("NDS|Molecules/Inputs", module)
  .addParameters({
    readme: {
      sidebar: CheckboxReadme,
    },
  })
  .add("Checkbox", () => (
    <PaddedWrapper>
      <Formik onSubmit={() => {}} initialValues={{ field2: true, field4: true }}>
        <form>
          <Checkbox name="field1" label="Default" />
          <Checkbox name="field2" label="Checked" />
          <Checkbox name="field3" label="Disabled" disabled />
          <Checkbox name="field4" label="Checked & disabled" disabled />
        </form>
      </Formik>
    </PaddedWrapper>
  ));
