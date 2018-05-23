import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { FormFieldDate } from "./FormFieldDate";

storiesOf("FormFieldDate", module).add("default", () => (
  <Formik initialValues={{}} onSubmit={() => {}}>
    {() => (
      <Form>
        <FormFieldDate label="Date of birth" name="dob" />
      </Form>
    )}
  </Formik>
));
