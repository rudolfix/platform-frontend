import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { FormRange } from "./FormRange";

storiesOf("forms/fields/Range", module)
  .addDecorator(withFormik)
  .add("default", () => <FormRange name="name" min={10} max={20} unit="%" />, {
    formik: {
      initialValues: { name: 15 },
    },
  })
  .add("with default value", () => <FormRange name="name" min={0} max={100} unit="%" />, {
    formik: {
      initialValues: { name: 70 },
    },
  })
  .add("with different step", () => <FormRange name="name" min={0} max={12} step={3} unit="px" />, {
    formik: {
      initialValues: { name: 6 },
    },
  })
  .add(
    "with different units",
    () => <FormRange name="name" min={1} max={5} unitMin="week" unitMax="weeks" />,
    {
      formik: {
        initialValues: { name: 3 },
      },
    },
  )
  .add("without unit", () => <FormRange name="name" min={0} max={10} step={2} />, {
    formik: {
      initialValues: { name: 4 },
    },
  });
