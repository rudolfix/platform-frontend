import { Dictionary, TDataTestId } from "@neufund/shared";
import * as cn from "classnames";
import { Field, FieldProps } from "formik";
import { map } from "lodash";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";

import { TTranslatedString } from "../../../../../types";
import { generateErrorId } from "../../layouts/FormError";
import { FormFieldError } from "../FormFieldError";
import { FormFieldLabel } from "../FormFieldLabel";
import { useFieldMeta } from "../utils";

import * as sharedStyles from "../FormStyles.module.scss";
import * as styles from "./FormSelectField.module.scss";

const NONE_KEY = "";
const BOOL_TRUE_KEY = "true";
const BOOL_FALSE_KEY = "false";

const boolifySingle = (value: string): boolean | string => {
  if (value === BOOL_TRUE_KEY) return true;

  if (value === BOOL_FALSE_KEY) return false;

  return value;
};

type TOwnProps = {
  extraMessage?: TTranslatedString;
};

type TFieldGroup = {
  name: string;
  disabled?: boolean;
  label?: TTranslatedString;
};

type TFormFieldOptions = {
  values?: Dictionary<TTranslatedString>;
  customOptions?: React.ReactElement[];
  disabledValues?: Dictionary<boolean>;
};

const FormSelectFieldOptions: React.FunctionComponent<TFormFieldOptions> = ({
  disabledValues,
  customOptions,
  values,
}) => {
  if (customOptions) {
    return <>{customOptions}</>;
  }

  return (
    <>
      {map(values, (value, key) => {
        if (typeof value === "string") {
          return (
            <option key={key} value={key} disabled={disabledValues && disabledValues[key]}>
              {value}
            </option>
          );
        } else {
          // If it's an intl 'FormattedMessage' clone it with function as a child
          // otherwise React will render '[Object object]' as on 'option' value
          // see https://github.com/facebook/react/issues/13586
          return React.cloneElement(value, { key }, (message: string) => (
            <option value={key} disabled={disabledValues && disabledValues[key]}>
              {message}
            </option>
          ));
        }
      })}
    </>
  );
};

// TODO: move label and error message to withFormField
const FormSelectField: React.FunctionComponent<TFieldGroup &
  TOwnProps &
  TFormFieldOptions &
  TDataTestId> = ({
  label,
  name,
  extraMessage,
  disabled,
  disabledValues,
  customOptions,
  values,
  "data-test-id": dataTestId,
}) => {
  const { invalid, changeValue } = useFieldMeta(name);

  return (
    <FormGroup>
      {label && <FormFieldLabel name={name}>{label}</FormFieldLabel>}
      <div className={cn(styles.customSelect, { [styles.disabled]: disabled })}>
        {/* TODO: Check if we can pass type `select` and multiple prop here to reduce boilerplate */}
        <Field name={name}>
          {({ field }: FieldProps) => (
            <Input
              {...field}
              data-test-id={dataTestId}
              aria-describedby={`${generateErrorId(name)} ${name}-extra-message`}
              aria-invalid={invalid}
              invalid={invalid}
              disabled={disabled}
              type="select"
              value={field.value}
              onChange={event => {
                const value = event.target.value;

                // provide a proper boolean value for
                // BOOL_TRUE_KEY and BOOL_FALSE_KEY
                changeValue(boolifySingle(value));
              }}
            >
              <FormSelectFieldOptions
                customOptions={customOptions}
                disabledValues={disabledValues}
                values={values}
              />
            </Input>
          )}
        </Field>
      </div>
      <FormFieldError name={name} />

      {extraMessage && (
        <div id={`${name}-extra-message`} className={sharedStyles.noteLabel}>
          {extraMessage}
        </div>
      )}
    </FormGroup>
  );
};

export { FormSelectField, NONE_KEY, BOOL_TRUE_KEY, BOOL_FALSE_KEY };
