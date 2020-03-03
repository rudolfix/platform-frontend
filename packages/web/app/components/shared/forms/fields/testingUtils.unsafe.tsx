import { Formik } from "formik";
import * as React from "react";
import { ObjectSchema } from "yup";

import { FormDeprecated } from "../FormDeprecated";

type TFormWrapperParams<T extends {}> = {
  formState: any;
  onSubmit?: (values: any) => any;
  validationSchema?: ObjectSchema<T>;
};

/**
 * Use only for testing. For storybook use `storybook-formik` decorator.
 */
export const formWrapper = <T extends {}>({
  formState,
  onSubmit = () => {},
  validationSchema,
}: TFormWrapperParams<T>) => (Component: React.FunctionComponent) => () => (
  <Formik
    initialValues={formState}
    validationSchema={validationSchema}
    onSubmit={async values => await onSubmit(values)}
  >
    {({ submitForm, values, submitCount, isSubmitting }) => {
      if (process.env.STORYBOOK_RUN === "1") {
        // tslint:disable-next-line
        console.log(JSON.stringify(values));
      }

      return (
        <FormDeprecated>
          <Component />

          <button type="submit" data-test-id="test-form-submit" onClick={submitForm}>
            Submit
          </button>

          {
            <>
              Submit count: <span data-test-id="test-form-submit-count">{submitCount}</span>
              Is submitting:{" "}
              <span data-test-id="test-form-is-submitting">{isSubmitting.toString()}</span>
            </>
          }
        </FormDeprecated>
      );
    }}
  </Formik>
);
