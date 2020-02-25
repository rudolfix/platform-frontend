import { Field, useFormikContext } from "formik";
import * as React from "react";

import { TDataTestId } from "../../../types";
import { getSchemaField, getValidationSchema, isRequired } from "../../../utils/yupUtils";
import { applyCharactersLimit, useFieldMeta } from "../forms/fields/utils";
import { InlineIcon } from "../icons/InlineIcon";
import { Input } from "./Input";
import { InputBase } from "./InputBase";
import { InputDescription } from "./InputDescription";
import { InputError } from "./InputError";
import { LabelBase } from "./LabelBase";

import eyeUnstrikedIcon from "../../../assets/img/inline_icons/password-eye_masked.svg";
import eyeStrikedIcon from "../../../assets/img/inline_icons/password-eye_unmasked.svg";
import * as styles from "./TextField.module.scss";

const transform = (value: string) => (value !== undefined ? value : "");

const transformBack = (value: number | string, charactersLimit?: number) => {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return value.trim().length > 0 ? applyCharactersLimit(value, charactersLimit) : undefined;
  } else {
    return undefined;
  }
};

type TFieldProps = {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  placeholder?: string;
  ignoreTouched?: boolean;
};

export const TextField: React.FunctionComponent<TFieldProps &
  TDataTestId &
  React.ComponentProps<typeof InputBase>> = ({
  "data-test-id": dataTestId,
  name,
  label,
  description,
  disabled,
  placeholder,
  type,
  maxLength,
  ignoreTouched,
  autoFocus,
  className,
  ...props
}) => {
  const [unmaskPassword, setUnmaskPassword] = React.useState(false);
  // right now there's only one type of adornment, password mask icon
  const hasAdornment = type === "password";
  const overridingType = hasAdornment && unmaskPassword ? "text" : type;

  const { setFieldTouched, setFieldValue, validationSchema } = useFormikContext();

  const { invalid, error, value } = useFieldMeta(name, { ignoreTouched: !!ignoreTouched });

  const schema = getValidationSchema(validationSchema);
  const fieldSchema = getSchemaField(name, schema);

  const transformedValue = transform(value);

  return (
    <Field name={name}>
      {() => (
        <div data-test-id={dataTestId}>
          {label && (
            <LabelBase htmlFor={name} isOptional={!isRequired(fieldSchema)}>
              {label}
            </LabelBase>
          )}

          <div className={styles.inputWrapper}>
            <Input
              type={overridingType}
              value={transformedValue}
              id={name}
              aria-describedby={description ? `${name}-description` : undefined}
              aria-invalid={invalid}
              autoFocus={autoFocus}
              disabled={disabled}
              placeholder={placeholder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldTouched(name);
                setFieldValue(
                  name,
                  transformBack(
                    type === "number" && e.target.value !== ""
                      ? e.target.valueAsNumber
                      : e.target.value,
                    maxLength,
                  ),
                );
              }}
              {...props}
            />
            {hasAdornment && (
              <div className={styles.adornmentWrapper}>
                <button
                  type="button"
                  className={styles.adornment}
                  onClick={() => setUnmaskPassword(!unmaskPassword)}
                >
                  <InlineIcon
                    className={styles.eyeIcon}
                    svgIcon={unmaskPassword ? eyeUnstrikedIcon : eyeStrikedIcon}
                  />
                </button>
              </div>
            )}
          </div>

          {invalid && error && <InputError name={name}>{error}</InputError>}

          {description && <InputDescription name={name}>{description}</InputDescription>}
        </div>
      )}
    </Field>
  );
};
