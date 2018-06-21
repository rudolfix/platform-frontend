import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, InputGroup, InputGroupAddon, Label } from "reactstrap";

import { CommonHtmlProps } from "../../../../types";
import { isNonValid } from "./utils";

interface IFieldGroup {
  label?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}
type FieldGroupProps = IFieldGroup & FieldAttributes & CommonHtmlProps;
export class FormTextArea extends React.Component<FieldGroupProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactChild {
    const { label, placeholder, name, prefix, suffix, className } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const { touched, errors } = formik;
    return (
      <FormGroup>
        {label && <Label for={name}>{label}</Label>}
        <Field
          name={name}
          render={({ field }: FieldProps) => (
            <InputGroup>
              {prefix && (
                <InputGroupAddon addonType="prepend" className={className}>
                  {prefix}
                </InputGroupAddon>
              )}
              <textarea
                {...field}
                value={field.value || ""}
                placeholder={placeholder || label}
                className={className}
              />
              {suffix && <InputGroupAddon addonType="append">{suffix}</InputGroupAddon>}
            </InputGroup>
          )}
        />
        {isNonValid(touched, errors, name) && <div>{errors[name]}</div>}
      </FormGroup>
    );
  }
}
