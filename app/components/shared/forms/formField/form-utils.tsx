import { Form, Formik } from "formik";
import * as React from "react";

/**
 * Use only for testing / in storyboard.
 */
export const formWrapper = (formState: any, onSubmit?: (values: any) => any) => (
  Component: React.SFC,
) => () => (
  <Formik initialValues={formState} onSubmit={onSubmit || (() => {})}>
    {({ submitForm }) => {
      return (
        <Form>
          <Component />

          {onSubmit && (
            <button data-test-id="test-form-submit" onClick={submitForm}>
              Submit
            </button>
          )}
        </Form>
      );
    }}
  </Formik>
);
