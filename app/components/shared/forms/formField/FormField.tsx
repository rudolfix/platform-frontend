import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, InputType } from "../../../../types";
import { isNonValid, isValid } from "./utils";

import { FormLabel } from "./FormLabel";

import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  label?: string | React.ReactNode;
  placeholder?: string | React.ReactNode;
  type?: InputType;
  prefix?: string;
  suffix?: string;
  addonStyle?: string;
  maxLength?: string;
  additionalObjValue?: { name: string; value: string };
}
type FieldGroupProps = IFieldGroup & FieldAttributes & CommonHtmlProps;

export class FormField extends React.Component<FieldGroupProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  componentDidMount(): void {
    const formik: FormikProps<any> = this.context.formik;

    if (this.props.additionalObjValue) {
      formik.setFieldValue(this.props.additionalObjValue.name, this.props.additionalObjValue.value);
    }
  }

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
      additionalObjValue,
      ...props
    } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const { touched, errors } = formik;

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
                value={field.value || this.props.additionalObjValue && " " || ""}
                valid={isValid(touched, errors, name)}
                placeholder={placeholder || label}
                {...inputExtraProps}
                {...props}
              />
              {suffix && (
                <InputGroupAddon addonType="append" className={styles.addon}>
                  {suffix}
                </InputGroupAddon>
              )}
            </InputGroup>
          )}
        />
        {isNonValid(touched, errors, name) && (
          <div className={styles.errorLabel}>{errors[name]}</div>
        )}
      </FormGroup>
    );
  }
}
