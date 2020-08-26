import { TDataTestId } from "@neufund/shared-utils";
import * as React from "react";

import * as styles from "./SimpleTextInput.module.scss";

type TTextInputProps = {
  name: string;
  value: string;
  placeholder: string;
  isValid: boolean;
  disabled: boolean;
} & TDataTestId;

export const SimpleTextInput: React.FunctionComponent<TTextInputProps> = ({
  name,
  value,
  placeholder = "",
  isValid,
  disabled,
  "data-test-id": dataTestId,
}) => (
  <input
    className={styles.textInput}
    type="text"
    name={name}
    value={value}
    aria-describedby={`${name}-description`}
    aria-invalid={!isValid}
    disabled={disabled}
    placeholder={placeholder}
    data-test-id={dataTestId}
    onChange={() => undefined}
  />
);
