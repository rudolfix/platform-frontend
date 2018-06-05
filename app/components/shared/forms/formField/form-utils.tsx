import { Form, Formik } from "formik";
import * as React from "react";

export const formWrapper = (formState: any) => (Component: React.SFC) => () => (
  <Formik initialValues={formState} onSubmit={() => {}}>
    {() => {
      return (
        <Form>
          <Component />
        </Form>
      );
    }}
  </Formik>
);
