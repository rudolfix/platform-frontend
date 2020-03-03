import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { NumberTransformingField } from "./NumberTransformingField";

storiesOf("forms/fields/TransformingField", module)
  .addDecorator(withFormik)
  .add("with ratio", () => <NumberTransformingField name="name" ratio={100} />, {
    formik: {
      initialValues: { name: 0.5 },
    },
  })
  .add("no ratio", () => <NumberTransformingField name="name" />, {
    formik: {
      initialValues: { name: 0.5 },
    },
  });
