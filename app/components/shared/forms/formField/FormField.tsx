import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon, Label } from "reactstrap";

import { InputType } from "../../../../types";
import { isNonValid, isValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  label?: string;
  placeholder?: string;
  type?: InputType;
  prefix?: string;
  doNotShowLabel?: boolean;
  className?: string;
  suffix?: string;
}
type FieldGroupProps = IFieldGroup & FieldAttributes;

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
      doNotShowLabel,
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
        {!doNotShowLabel && label && <Label for={name}>{label}</Label>}
        <Field
          name={name}
          render={({ field }: FieldProps) => (
            <InputGroup>
              {prefix && (
                <InputGroupAddon addonType="prepend" className={styles.addon}>
                  {prefix}
                </InputGroupAddon>
              )}
              <Input
                className={className}
                {...field}
                type={type}
                value={field.value || ""}
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
        <div className={styles.errorLabel}>
          {isNonValid(touched, errors, name) && <div>{errors[name]}</div>}
        </div>
      </FormGroup>
    );
  }
}
