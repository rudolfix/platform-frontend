import { TDataTestId } from "@neufund/shared-utils";
import * as React from "react";

import { TFormFieldData, TTranslatedString } from "../../../types";
import { SimpleFormError } from "./SimpleFormError";
import { SimpleFormLabel } from "./SimpleFormLabel";
import { SimpleTextInput } from "./SimpleTextInput";

type TTextFieldProps = {
  data: TFormFieldData<string>;
  path: string;
  placeholder?: string;
  labelText: TTranslatedString;
} & TDataTestId;

export const SimpleTextField: React.FunctionComponent<TTextFieldProps> = ({
  data: { value, errors, isValid, disabled, showErrors },
  path,
  "data-test-id": dataTestId,
  placeholder = "",
  labelText,
}) => (
  <div>
    {labelText && <SimpleFormLabel name={path} labelText={labelText} />}
    <SimpleTextInput
      name={path}
      value={value}
      placeholder={placeholder}
      isValid={!showErrors || isValid}
      disabled={disabled}
      data-test-id={dataTestId}
    />
    {!!errors.length &&
      showErrors &&
      errors.map((error, i) => (
        <SimpleFormError key={i} name={path} error={error} data-test-id={dataTestId} />
      ))}
  </div>
);
