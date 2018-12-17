import * as cn from "classnames";
import { FormikConsumer, getIn } from "formik";
import { get } from "lodash";
import * as React from "react";
import { isNonValid } from "./utils";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";

import * as styles from "./FormFieldError.module.scss";

export interface IFormErrorExternalProps {
  name?: string;
  message: TTranslatedString;
  alignLeft?: boolean;
}

export interface IProps {
  name: string;
  defaultMessage?: TTranslatedString;
  ignoreTouched?: boolean;
  className?: string;
  alignLeft?: boolean;
}

const FormError: React.SFC<IFormErrorExternalProps & CommonHtmlProps> = ({
  message,
  name,
  className,
  alignLeft,
}) => (
  <div
    data-test-id={name && `form.${name}.error-message`}
    className={cn(styles.errorLabel, { [styles.errorLabelAlignLeft]: alignLeft }, className)}
  >
    {message}
  </div>
);

const FormFieldError: React.SFC<IProps> = ({
  name,
  defaultMessage,
  ignoreTouched,
  className,
  alignLeft,
}) => (
  <FormikConsumer>
    {({ touched, errors, submitCount }) => {
      const touchedSubmitCountIncluded = {
        ...touched,
        [name]: get(touched, name) || submitCount > 0,
      };
      return (
        isNonValid(touchedSubmitCountIncluded, errors, name, ignoreTouched) && (
          <FormError
            name={name}
            message={getIn(errors, name) || defaultMessage}
            className={className}
            alignLeft={alignLeft}
          />
        )
      );
    }}
  </FormikConsumer>
);

export { FormFieldError, FormError };
