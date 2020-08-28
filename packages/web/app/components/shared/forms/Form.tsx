// tslint:disable-next-line:import-blacklist
import { Form as FormikForm, Formik, FormikConfig, FormikErrors, FormikProps } from "formik";
import difference from "lodash/fp/difference";
import isEmpty from "lodash/fp/isEmpty";
import * as React from "react";

import { CommonHtmlProps, TDataTestId } from "../../../types";
import { useDeepMemo } from "../hooks/useDeepMemo";
import { useLogger } from "../hooks/useLogger";
import { usePrevious } from "../hooks/usePrevious";

const INVALID_FIELD_SELECTOR = "[aria-invalid='true']";

export type TFormProps<Values = {}> = FormikConfig<Values> & { className?: string } & TDataTestId;

type TLayoutProps<Values = {}> = { children: React.ReactNode } & CommonHtmlProps &
  TDataTestId &
  FormikProps<Values>;

const useFocusFirstInvalid = <Values extends {}>(
  isSubmitting: boolean,
  isValid: boolean,
  formikErrors: FormikErrors<Values>,
) => {
  const logger = useLogger();
  const previousIsSubmitting = usePrevious(isSubmitting);

  React.useEffect(() => {
    if (previousIsSubmitting && !isSubmitting && !isValid) {
      const invalidInput = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        INVALID_FIELD_SELECTOR,
      );

      if (invalidInput) {
        invalidInput.focus();
      } else {
        const errors = JSON.stringify(formikErrors);
        logger.warn(`It's not possible to focus invalid field! Errors: ${errors}`);
      }
    }
  }, [isSubmitting, isValid]);
};

const FormLayout = <Values extends {}>({
  className,
  children,
  "data-test-id": dataTestId,
  isSubmitting,
  isValid,
  errors,
}: TLayoutProps<Values>) => {
  useFocusFirstInvalid<Values>(isSubmitting, isValid, errors);

  return (
    <FormikForm className={className} data-test-id={dataTestId}>
      {children}
    </FormikForm>
  );
};

/**
 * Guards form values to only contain keys from passed validation schema
 * For performance should be skipped in production.
 */
const SchemaFieldsGuard = <Values extends {}>({
  validationSchema,
  initialValues,
}: FormikConfig<Values>) => {
  const logger = useLogger();

  React.useEffect(() => {
    const schemaKeys = Object.keys(validationSchema.fields);
    const valuesKeys = Object.keys(initialValues);

    const diff = difference(valuesKeys, schemaKeys);
    if (!isEmpty(diff)) {
      logger.warn(
        `You have a difference between schema fields and initial values.
         Following properties do not exist in "validationSchema" but they are passed as "initialValues": ${diff.join(
           ", ",
         )}.
         This often leads to bugs when more data is saved then it's needed`,
        new Error("Schema is out of sync with passed values"),
      );
    }
  }, [validationSchema, initialValues, logger]);

  return null;
};

const Form = <Values extends {}>({
  children,
  className,
  initialValues,
  validationSchema,
  validate,
  validateOnMount,
  enableReinitialize,
  "data-test-id": dataTestId,
  ...props
}: TFormProps<Values>) => {
  // always return the same reference when value is deeply equal
  // otherwise formik will rererun validation every time it sees a new reference
  const initialValuesMemoized = useDeepMemo(() => initialValues, [initialValues]);

  return (
    <>
      {__DEV__ && validationSchema && (
        <SchemaFieldsGuard<Values>
          {...props}
          validationSchema={validationSchema}
          initialValues={initialValuesMemoized}
        />
      )}
      <Formik<Values>
        {...props}
        validate={validate}
        validationSchema={validationSchema}
        initialValues={initialValuesMemoized}
        enableReinitialize={!!enableReinitialize}
        validateOnMount={!!validateOnMount}
      >
        {formikProps => (
          <FormLayout {...formikProps} className={className} data-test-id={dataTestId}>
            {typeof children === "function" ? children(formikProps) : children}
          </FormLayout>
        )}
      </Formik>
    </>
  );
};

export { Form };
