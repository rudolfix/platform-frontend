import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { FormCheckbox } from "./FormCheckbox";

const formWrapper = (formState: any) => (Component: React.SFC) => () => (
  <Formik initialValues={formState} onSubmit={() => {}}>
    {() => (
      <Form>
        <Component />
      </Form>
    )}
  </Formik>
);

storiesOf("FormCheckbox", module)
  .add(
    "checkbox",
    formWrapper({ name: "checkbox" })(() => (
      <FormCheckbox type="checkbox" label="checkbox's label" name="checkbox" />
    )),
  )
  .add(
    "radio",
    formWrapper({ name: "checkbox" })(() => (
      <>
        <FormCheckbox type="radio" label="checkbox's label" name="radio" />
        <FormCheckbox type="radio" label="checkbox's label" name="radio" />
        <FormCheckbox type="radio" label="checkbox's label" name="radio" />
      </>
    )),
  );
