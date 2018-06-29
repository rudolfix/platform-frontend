import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, InputGroup, InputGroupAddon } from "reactstrap";
import { FormLabel } from "./FormLabel";

import { CommonHtmlProps } from "../../../../types";
import { isNonValid } from "./utils";

interface IFieldGroup {
  label?: string | React.ReactNode;
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
        {label && <FormLabel>{label}</FormLabel>}
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
                placeholder={placeholder}
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
