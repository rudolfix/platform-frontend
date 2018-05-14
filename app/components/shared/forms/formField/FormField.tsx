import {
  Field,
  FieldAttributes,
  FieldProps,
  FormikErrors,
  FormikProps,
  FormikTouched,
} from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon, Label } from "reactstrap";

import { get } from "lodash";
import { InputType } from "../../../../types";
import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  label?: string;
  placeholder?: string;
  type?: InputType;
  prefix?: string;
  suffix?: string;
}
type FieldGroupProps = IFieldGroup & FieldAttributes;

/* The function that encapsulates the logic of determining a value for Input field valid property. Note we have to
   return boolean | undefined value. Undefined should be returned when the field has not been touched by the user. */
export const isValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  key: string,
): boolean | undefined => {
  if (touched && get(touched, key) !== true) {
    return undefined;
  }

  return !(errors && get(errors, key));
};

export const isNonValid = (
  errors: FormikErrors<any>,
  touched: FormikTouched<any>,
  name: string,
): boolean | undefined => {
  const argument = isValid(touched, errors, name);
  if (argument === undefined || argument === true) return false;
  else return true;
};

export class FormField extends React.Component<FieldGroupProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactChild {
    const { label, type, placeholder, name, prefix, suffix, ...props } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const { touched, errors } = formik;

    //This is done due to the difference between reactstrap and @typings/reactstrap
    const inputExtraProps = {
      invalid: isNonValid(touched, errors, name),
    } as any;
    return (
      <FormGroup>
        {label && <Label for={name}>{label}</Label>}
        <Field
          name={name}
          render={({ field }: FieldProps) => (
            <InputGroup>
              {prefix && <InputGroupAddon addonType="prepend">{prefix}</InputGroupAddon>}
              <Input
                {...field}
                type={type}
                value={field.value || ""}
                valid={isValid(touched, errors, name)}
                placeholder={placeholder || label}
                {...inputExtraProps}
                {...props}
              />
              {suffix && <InputGroupAddon addonType="append">{suffix}</InputGroupAddon>}
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
