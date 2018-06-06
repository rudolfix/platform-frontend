import { Form, Formik } from "formik";
import * as React from "react";

/**
 * Use only for testing / in storyboard.
 */
export const formWrapper = (formState: any) => (Component: React.SFC) => () => (
  <Formik initialValues={formState} onSubmit={() => {}}>
    {({ values }) => {
      // tslint:disable-next-line
      console.log("Form values: ", values);
      return (
        <Form>
          <Component />
        </Form>
      );
    }}
  </Formik>
);
