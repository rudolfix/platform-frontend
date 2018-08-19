import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikProps, getIn } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, InputType } from "../../../../types";
import { FormLabel } from "./FormLabel";
import { isNonValid, isValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  label?: string | React.ReactNode;
  placeholder?: string | React.ReactNode;
  type?: InputType;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  addonStyle?: string;
  maxLength?: string;
  charactersLimit?: number;
}

type FieldGroupProps = IFieldGroup & FieldAttributes & CommonHtmlProps;

export class FormField extends React.Component<FieldGroupProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactChild {
    const {
      label,
      type,
      placeholder,
      name,
      prefix,
      suffix,
      className,
      addonStyle,
      charactersLimit,
      ...props
    } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const { touched, errors } = formik;

    const computedValue = (value: string | undefined, limit: number | undefined): string => {
      if (!value) {
        return "";
      }

      if (!limit) {
        return value;
      }

      return charactersLimit && value.length > limit ? value.slice(0, charactersLimit - 1) : value;
    };

    const countedCharacters = (value: string | undefined, limit: number | undefined): string => {
      return `${computedValue(value, limit).length}/${limit}`;
    };

    //This is done due to the difference between reactstrap and @typings/reactstrap
    const inputExtraProps = {
      invalid: isNonValid(touched, errors, name),
    } as any;
    return (
      <FormGroup>
        {label && <FormLabel>{label}</FormLabel>}
        <Field
          name={name}
          render={({ field }: FieldProps) => (
            <>
              <InputGroup>
                {prefix && (
                  <InputGroupAddon addonType="prepend" className={cn(styles.addon, addonStyle)}>
                    {prefix}
                  </InputGroupAddon>
                )}
                <Input
                  className={cn(className, styles.inputField)}
                  {...field}
                  type={type}
                  value={computedValue(field.value, charactersLimit)}
                  valid={isValid(touched, errors, name)}
                  placeholder={placeholder}
                  {...inputExtraProps}
                  {...props}
                />
                {suffix && (
                  <InputGroupAddon addonType="append" className={styles.addon}>
                    {suffix}
                  </InputGroupAddon>
                )}
              </InputGroup>
              {isNonValid(touched, errors, name) && (
                <div className={styles.errorLabel}>{getIn(errors, name)}</div>
              )}
              {charactersLimit && <div>{countedCharacters(field.value, charactersLimit)}</div>}
            </>
          )}
        />
      </FormGroup>
    );
  }
}
