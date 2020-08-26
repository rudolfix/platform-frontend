import * as React from "react";

import { TTranslatedString } from "../../../types";

import * as styles from "./SimpleFormLabel.module.scss";

type TFormLabelProps = {
  labelText: TTranslatedString;
  name: string;
};

export const SimpleFormLabel: React.FunctionComponent<TFormLabelProps> = ({ labelText, name }) => (
  <label htmlFor={name} className={styles.label}>
    {labelText}
  </label>
);
