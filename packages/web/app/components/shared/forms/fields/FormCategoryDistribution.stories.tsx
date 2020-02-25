import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { ArrayOfKeyValueFields } from "./FormCategoryDistribution";

storiesOf("forms/fields/CategoryDistribution", module)
  .addDecorator(withFormik)
  .add(
    "default",
    () => (
      <ArrayOfKeyValueFields
        label="HOW WILL YOU USE THE RAISED CAPITAL?"
        name="test"
        paragraphName="paragraph"
        suggestions={["suggestion1", "suggestion2", "suggestion3"]}
        fieldNames={["description", "percent"]}
      />
    ),
    {
      formik: {
        initialValues: {},
      },
    },
  )
  .add(
    "Pre-filled Data",
    () => (
      <ArrayOfKeyValueFields
        transformRatio={100}
        label="HOW WILL YOU USE THE RAISED CAPITAL?"
        name="test"
        paragraphName="paragraph"
        suggestions={["suggestion1", "suggestion2", "suggestion3"]}
        fieldNames={["description", "percent"]}
      />
    ),
    {
      formik: {
        initialValues: {
          test: [
            { description: "Important Category", percent: "10" },
            { description: "ESOP", percent: "30" },
          ],
        },
      },
    },
  );
