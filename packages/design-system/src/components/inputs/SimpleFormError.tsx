import { TDataTestId } from "@neufund/shared-utils";
import * as React from "react";

import { TTranslatedString } from "../../types";

import * as styles from "./SimpleFormError.module.scss"

type TFormErrorProps = {
  name: string,
  error: TTranslatedString
} & TDataTestId

export const SimpleFormError: React.FunctionComponent<TFormErrorProps> = ({
  error,
  'data-test-id': dataTestId
}) =>
  <p className={styles.errorMessage} data-test-id={`${dataTestId}-error`} role="alert">
    {error}
  </p>
