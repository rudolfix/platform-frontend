import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormFeedback, FormGroup, InputGroup, InputGroupAddon, Label } from "reactstrap";

interface IFieldGroup {
  label?: string;
  placeholder?: string;
  touched?: { [name: string]: boolean }; // deprecated, remove from other forms
  errors?: { [name: string]: string }; // deprecated, remove from other forms
  prefix?: string;
  suffix?: string;
}
type FieldGroupProps = IFieldGroup & FieldAttributes;
export class FormTextArea extends React.Component<FieldGroupProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactChild {
    const { label, placeholder, name, prefix, suffix } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const { errors } = formik;
    return (
      <FormGroup>
        {label && <Label for={name}>{label}</Label>}
        <Field
          name={name}
          render={({ field }: FieldProps) => (
            <InputGroup>
              {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
              <textarea {...field} value={field.value || ""} placeholder={placeholder || label} />
              {suffix && <InputGroupAddon>{suffix}</InputGroupAddon>}
            </InputGroup>
          )}
        />
        {errors[name] && <FormFeedback>{errors[name]}</FormFeedback>}
      </FormGroup>
    );
  }
}
