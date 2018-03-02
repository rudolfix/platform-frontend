import { Field, FieldAttributes, FieldProps } from "formik";
import * as React from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { InputType } from "../../../../types";

interface IFieldGroup {
  label?: string;
  placeholder?: string;
  touched: { [name: string]: boolean };
  errors: { [name: string]: string };
  type?: InputType;
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

export const FormField: React.SFC<FieldGroupProps> = ({ label, name, type, ...props }) => (
  <FormGroup>
    {label && <Label for={name}>{label}</Label>}
    <Field
      name={name}
      render={({ field }: FieldProps) => (
        <Input
          {...field}
          type={type}
          value={field.value || ""}
          placeholder={props.placeholder}
          valid={isValid(props.touched, props.errors, name)}
        />
      )}
    />
    {props.errors[name] && <FormFeedback>{props.errors[name]}</FormFeedback>}
  </FormGroup>
);
