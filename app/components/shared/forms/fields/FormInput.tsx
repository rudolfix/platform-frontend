import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, InputType, TTranslatedString } from "../../../../types";
import { FormFieldError } from "./FormFieldError";
import { getComputedValue, isNonValid, isValid, withCountedCharacters } from "./utils";

import * as styles from "./FormStyles.module.scss";

export enum InputSize {
  NORMAL = "",
  SMALL = "sm",
}

export interface IFormInputExternalProps {
  min?: string;
  max?: string;
  placeholder?: TTranslatedString;
  errorMsg?: TTranslatedString;
  type?: InputType;
  prefix?: TTranslatedString;
  suffix?: TTranslatedString;
  addonStyle?: string;
  maxLength?: number;
  charactersLimit?: number;
  size?: InputSize;
  customValidation?: (value: any) => string | Function | Promise<void> | undefined;
  customOnBlur?: Function;
  ignoreTouched?: boolean;
}

export type FormInputProps = IFormInputExternalProps & FieldAttributes<any> & CommonHtmlProps;

const transform = (value: string, charactersLimit?: number) => {
  return value !== undefined ? getComputedValue(value, charactersLimit) : "";
};

const transformBack = (value: number | string) => {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return value.trim().length > 0 ? value : undefined;
  } else {
    return undefined;
  }
};

/**
 * Formik connected form input without FormGroup and FormFieldLabel.
 */
export class FormInput extends React.Component<FormInputProps> {
  static defaultProps = {
    size: InputSize.NORMAL,
  };

  render(): React.ReactNode {
    const {
      type,
      placeholder,
      name,
      prefix,
      suffix,
      className,
      addonStyle,
      charactersLimit,
      errorMsg,
      size,
      disabled,
      customValidation,
      customOnBlur,
      ignoreTouched,
      maxLength,
      ...props
    } = this.props;
    return (
      <FormikConsumer>
        {({ touched, errors, setFieldTouched, setFieldValue }) => {
          const invalid = isNonValid(touched, errors, name, ignoreTouched);

          return (
            <Field
              name={name}
              validate={customValidation}
              render={({ field }: FieldProps) => {
                const val = transform(field.value, charactersLimit);
                return (
                  <div>
                    <InputGroup size={size}>
                      {prefix && (
                        <InputGroupAddon
                          addonType="prepend"
                          className={cn(styles.addon, addonStyle, { "is-invalid": invalid })}
                        >
                          {prefix}
                        </InputGroupAddon>
                      )}
                      <Input
                        id={name}
                        maxLength={maxLength}
                        className={cn(className, styles.inputField, { "is-invalid": invalid })}
                        {...field}
                        onChange={e => {
                          setFieldTouched(name);
                          setFieldValue(
                            name,
                            transformBack(
                              type === "number" && e.target.value !== ""
                                ? e.target.valueAsNumber
                                : e.target.value,
                            ),
                          );
                        }}
                        onBlur={e => {
                          if (customOnBlur) {
                            customOnBlur(e);
                          }
                        }}
                        type={type}
                        value={val}
                        valid={isValid(touched, errors, name)}
                        placeholder={placeholder}
                        disabled={disabled}
                        invalid={invalid}
                        {...props}
                      />
                      {suffix && (
                        <InputGroupAddon
                          addonType="append"
                          className={cn(styles.addon, { "is-invalid": invalid })}
                        >
                          {suffix}
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                    <FormFieldError
                      name={name}
                      defaultMessage={errorMsg}
                      ignoreTouched={ignoreTouched}
                    />
                    {charactersLimit && <div>{withCountedCharacters(val, charactersLimit)}</div>}
                  </div>
                );
              }}
            />
          );
        }}
      </FormikConsumer>
    );
  }
}
