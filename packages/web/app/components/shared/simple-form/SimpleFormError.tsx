import { TDataTestId } from "@neufund/shared-utils";
import * as React from "react";

import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";

import * as styles from "./SimpleFormError.module.scss";

type TFormErrorProps = {
  name: string;
  error: TMessage;
} & TDataTestId;

export const SimpleFormError: React.FunctionComponent<TFormErrorProps> = ({
  error,
  "data-test-id": dataTestId,
}) => (
  <p className={styles.errorMessage} data-test-id={`${dataTestId}-error`} role="alert">
    {getMessageTranslation(error)}
  </p>
);
