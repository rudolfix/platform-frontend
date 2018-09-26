import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, getIn } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, InputType } from "../../../../types";
import { computedValue, countedCharacters } from "./FormFieldRaw";
import { isNonValid, isValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

export enum InputSize {
  NORMAL = "",
  SMALL = "sm",
}

export interface IFormInputExternalProps {
  min?: string;
  max?: string;
  placeholder?: string | React.ReactNode;
  errorMsg?: string | React.ReactNode;
  type?: InputType;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  addonStyle?: string;
  maxLength?: string;
  charactersLimit?: number;
  size?: InputSize;
}

export type FormInputProps = IFormInputExternalProps & FieldAttributes & CommonHtmlProps;

/**
 * Formik connected form input without FormGroup and FormLabel.
 */
export class FormInput extends React.Component<FormInputProps> {
  static defaultProps = {
    size: InputSize.NORMAL,
  };

  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactChild {
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
      min,
      max,
      size,
      ...props
    } = this.props;
    const { touched, errors } = this.context.formik;

    //This is done due to the difference between reactstrap and @typings/reactstrap
    const inputExtraProps = {
      invalid: isNonValid(touched, errors, name),
    } as any;

    return (
      <Field
        name={name}
        render={({ field }: FieldProps) => {
          const val = computedValue(field.value, charactersLimit);
          return (
            <>
              <InputGroup size={size}>
                {prefix && (
                  <InputGroupAddon
                    addonType="prepend"
                    className={cn(
                      styles.addon,
                      addonStyle,
                      isValid(touched, errors, name) && "is-invalid",
                    )}
                  >
                    {prefix}
                  </InputGroupAddon>
                )}
                <Input
                  className={cn(
                    className,
                    styles.inputField,
                    isValid(touched, errors, name) && "is-invalid",
                  )}
                  {...field}
                  type={type}
                  value={val}
                  valid={isValid(touched, errors, name)}
                  placeholder={placeholder}
                  {...inputExtraProps}
                  {...props}
                />
                {suffix && (
                  <InputGroupAddon
                    addonType="append"
                    className={cn(styles.addon, isValid(touched, errors, name) && "is-invalid")}
                  >
                    {suffix}
                  </InputGroupAddon>
                )}
              </InputGroup>
              {isNonValid(touched, errors, name) && (
                <div className={styles.errorLabel}>{getIn(errors, name) || errorMsg}</div>
              )}
              {charactersLimit && <div>{countedCharacters(val, charactersLimit)}</div>}

              {min &&
                parseInt(field.value, 10) < parseInt(min, 10) && (
                  <div className={styles.errorLabel}>
                    <FormattedMessage id="form.field.error.number.min" values={{ min }} />
                  </div>
                )}

              {max &&
                parseInt(field.value, 10) > parseInt(max, 10) && (
                  <div className={styles.errorLabel}>
                    <FormattedMessage id="form.field.error.number.max" values={{ max }} />
                  </div>
                )}
            </>
          );
        }}
      />
    );
  }
}
