import { TDataTestId } from "@neufund/shared";
import * as React from "react";

import { TTranslatedString } from "../../types";

import styles from "./InputError.module.scss";

type TErrorProps = {
  children: TTranslatedString;
  name: string;
};

const InputError: React.FunctionComponent<TErrorProps & TDataTestId> = ({ name, children }) => (
  <p className={styles.errorMessage} id={`${name}-error`} role="alert">
    {children}
  </p>
);

export { InputError };
