import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { FormToggle } from "./FormToggle";

storiesOf("forms/fields/Toggle", module)
  .addDecorator(withFormik)
  .add("on", () => <FormToggle name="toggle" enabledLabel="on" disabledLabel="off" />, {
    formik: {
      initialValues: { toggle: true },
    },
  })
  .add("off", () => <FormToggle name="toggle" enabledLabel="on" disabledLabel="off" />, {
    formik: {
      initialValues: { toggle: false },
    },
  })
  .add(
    "disabled on",
    () => <FormToggle name="toggle" enabledLabel="on" disabledLabel="off" disabled />,
    {
      formik: {
        initialValues: { toggle: true },
      },
    },
  )
  .add(
    "disabled off",
    () => <FormToggle name="toggle" enabledLabel="on" disabledLabel="off" disabled />,
    {
      formik: {
        initialValues: { toggle: false },
      },
    },
  );
