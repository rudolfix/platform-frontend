import { Form as FormikForm, Formik, FormikConfig, FormikProps } from "formik";
import { difference, isEmpty } from "lodash/fp";
import * as React from "react";

// import { useLogger } from "../hooks/useLogger";

export type TFormProps<Values = {}> = FormikConfig<Values>;

/**
 * Guards form values to only contain keys from passed validation schema
 * For performance should be skipped in production.
 */
const SchemaFieldsGuard = <Values extends {}>({
  validationSchema,
  initialValues,
}: FormikConfig<Values>) => {
  // const logger = useLogger();
  //
  // React.useEffect(() => {
  //   const schemaKeys = Object.keys(validationSchema.fields);
  //   const valuesKeys = Object.keys(initialValues);
  //
  //   const diff = difference(valuesKeys, schemaKeys);
  //   if (!isEmpty(diff)) {
  //     logger.warn(
  //       `You have a difference between schema fields and initial values.
  //        Following properties do not exist in "validationSchema" but they are passed as "initialValues": ${diff.join(
  //          ", ",
  //        )}.
  //        This often leads to bugs when more data is saved then it's needed`,
  //       new Error("Schema is out of sync with passed values"),
  //     );
  //   }
  // }, [validationSchema, initialValues, logger]);

  return null;
};

const Form = <Values extends {}>({
  children,
  initialValues,
  validationSchema,
  validate,
  ...props
}: TFormProps<Values>) => {
  return (
    <>
      {__DEV__ && validationSchema && (
        <SchemaFieldsGuard<Values>
          {...props}
          validationSchema={validationSchema}
          initialValues={initialValues}
        />
      )}
      <Formik<Values>
        {...props}
        validate={validate}
        validationSchema={validationSchema}
        initialValues={initialValues}
        enableReinitialize={true}
        validateOnMount={true}
      >
        {formikProps => (typeof children === "function" ? children(formikProps) : children)}
      </Formik>
    </>
  );
};

export { Form };
