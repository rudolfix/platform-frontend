import * as React from "react";

import { Field, FieldAttributes, FieldProps } from "formik";

import { FormGroup, Input, Label } from "reactstrap";

import { InputType } from "../../../../types";

interface IFieldGroup {
  label: string;
  placeholder?: string;
  touched: { [name: string]: boolean };
  errors: { [name: string]: string };
  type?: InputType;
}
type FieldGroupProps = IFieldGroup & FieldAttributes;

export const FormField: React.SFC<FieldGroupProps> = ({ name, type, ...props }) => (
  <FormGroup>
    <Label for={name}>{props.label}</Label>
    <Field
      name={name}
      render={({ field }: FieldProps) => (
        <Input {...field} type={type} value={field.value || ""} placeholder={props.placeholder} />
      )}
    />
    {props.touched &&
      props.touched[name] &&
      props.errors &&
      props.errors[name] && <span className="text-danger">{props.errors[name]}</span>}
  </FormGroup>
);
