/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Formik, FormikConfig, isFunction } from "formik";
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
export type TFormProps<Values = {}> = FormikConfig<Values>;

/**
 * Wraps formik usage under single component.
 * Will make it easier to add custom form behaviour (for eg. scroll to first invalid)
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const Form = <Values extends {}>({
  children,
  initialValues,
  validationSchema,
  validate,
  ...props
}: TFormProps<Values>) => (
  <Formik<Values>
    {...props}
    validate={validate}
    validationSchema={validationSchema}
    initialValues={initialValues}
    enableReinitialize
    validateOnMount
  >
    {formikProps => (isFunction(children) ? children(formikProps) : children)}
  </Formik>
);

export { Form };
