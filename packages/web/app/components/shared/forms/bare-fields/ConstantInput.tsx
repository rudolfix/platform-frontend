import cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../../../types";
import { FormError } from "../layouts/FormError";

import * as styles from "./ConstantInput.module.scss";

interface IProps {
  value: string;
  className?: string;
  errorMessage?: TTranslatedString;
}

export const ConstantInput: React.FunctionComponent<IProps> = ({
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
