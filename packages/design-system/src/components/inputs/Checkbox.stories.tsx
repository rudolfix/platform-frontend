import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { BlockWrapper, PaddedWrapper } from "../../storybook-decorators";
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
      <Formik onSubmit={action("onSubmit")} initialValues={{ field2: true, field4: true }}>
        <form>
          <BlockWrapper>
            <Checkbox name="field1" label="Default" />
          </BlockWrapper>
          <BlockWrapper>
            <Checkbox name="field2" label="Checked" />
          </BlockWrapper>
          <BlockWrapper>
            <Checkbox name="field3" label="Disabled" disabled />
          </BlockWrapper>
          <BlockWrapper>
            <Checkbox name="field4" label="Checked & disabled" disabled />
          </BlockWrapper>
        </form>
      </Formik>
    </PaddedWrapper>
  ));
