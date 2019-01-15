import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../../../types";

import * as styles from "./FormConstantField.module.scss";
import { FormError } from "./FormFieldError";

interface IProps {
  value: string;
  className?: string;
  errorMessage?: TTranslatedString;
}

export const FormConstantField: React.SFC<IProps> = ({
  value,
  className,
  errorMessage,
  ...props
}) => (
  <div className={cn(styles.valueWrapper, className)} {...props}>
    {value}
    {errorMessage && <FormError message={errorMessage} className={styles.error} />}
  </div>
);
