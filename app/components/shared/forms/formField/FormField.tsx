import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon, Label } from "reactstrap";

import { InputType } from "../../../../types";
import * as styles from "./FormField.module.scss";

interface IFieldGroup {
  label?: string;
  placeholder?: string;
  touched?: { [name: string]: boolean }; // deprecated, remove from other forms
  errors?: { [name: string]: string }; // deprecated, remove from other forms
  type?: InputType;
  prefix?: string;
  suffix?: string;
}
type FieldGroupProps = IFieldGroup & FieldAttributes;

/* The function that encapsulates the logic of determining a value for Input field valid property. Note we have to
   return boolean | undefined value. Undefined should be returned when the field has not been touched by the user. */
const isValid = (
  touched: { [name: string]: boolean },
  errors: { [name: string]: string },
  name: string,
): boolean | undefined => {
  if (touched && touched[name] !== true) {
    return undefined;
  }

  return !(errors && errors[name]);
};

const isNonValid = (
  touched: { [name: string]: boolean },
  errors: { [name: string]: string },
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
    const { label, type, placeholder, name, prefix, suffix } = this.props;
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
              {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
              <Input
                {...field}
                type={type}
                value={field.value || ""}
                valid={isValid(touched, errors, name)}
                placeholder={placeholder || label}
                {...inputExtraProps}
              />
              {suffix && <InputGroupAddon>{suffix}</InputGroupAddon>}
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
