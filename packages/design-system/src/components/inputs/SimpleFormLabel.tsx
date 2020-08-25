import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../types";

import * as styles from "./SimpleFormLabel.module.scss"

type TFormLabelProps = {
  labelText: TTranslatedString,
  name: string,
  disabled: boolean
}

export const SimpleFormLabel: React.FunctionComponent<TFormLabelProps> = ({
  labelText,
  name,
  disabled
}) =>
  <label htmlFor={name} className={cn(styles.label, { [styles.labelDisabled]: disabled })}>
    {labelText}
  </label>
