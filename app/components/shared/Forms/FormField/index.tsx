import * as React from "react";

import { Field, FieldAttributes, FieldProps } from "formik";

import { FormGroup, Input, Label } from "reactstrap";

interface IFieldGroup {
  label: string;
  placeholder?: string;
  touched: { [name: string]: boolean };
  errors: { [name: string]: string };
}

type FieldGroupProps = IFieldGroup & FieldAttributes;

export const FormField: React.SFC<FieldGroupProps> = ({ name, ...props }) => (
  <FormGroup>
    <Label for={name}>{props.label}</Label>
    <Field
      name={name}
      render={({ field }: FieldProps) => (
        <Input {...field} value={field.value || ""} placeholder={props.placeholder} />
      )}
    />
    {props.touched &&
      props.touched[name] &&
      props.errors &&
      props.errors[name] && <span className="text-danger">{props.errors[name]}</span>}
  </FormGroup>
);
