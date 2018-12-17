import * as cn from "classnames";
import { FormikConsumer } from "formik";
import * as React from "react";

import { CommonHtmlProps } from "../../../../types";
import { isFieldRequired } from "./utils";

import * as styles from "./FormFieldLabel.module.scss";

export type FormLabelExternalProps = {
  for: string;
};

export type FormFieldLabelExternalProps = {
  name: string;
};

const FormLabel: React.SFC<FormLabelExternalProps & CommonHtmlProps> = ({
  for: htmlFor,
  children,
  className,
}) => (
  <label htmlFor={htmlFor} className={cn(styles.formLabel, className)}>
    {children}
  </label>
);

const FormFieldLabel: React.SFC<CommonHtmlProps & FormFieldLabelExternalProps> = ({
  children,
  name,
  ...rawProps
}) => {
  return (
    <FormikConsumer>
      {({ validationSchema }) => {
        if (validationSchema) {
          return (
            <FormLabel for={name} {...rawProps}>
              {children}
              {isFieldRequired(validationSchema, name) && " *"}
            </FormLabel>
          );
        }

        return (
          <FormLabel for={name} {...rawProps}>
            {children}
          </FormLabel>
        );
      }}
    </FormikConsumer>
  );
};

export { FormFieldLabel, FormLabel };
