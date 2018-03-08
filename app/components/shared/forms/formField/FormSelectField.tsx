import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { map } from 'lodash'

import { InputType } from "../../../../types";



interface IFieldGroup {
  label?: string;
  values: {
    [key: string]: string
  }
}
type FieldGroupProps = IFieldGroup & FieldAttributes;

/* The function that encapsulates the logic of determniing a value for Input field valid property. Note we have to
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

export class FormSelectField extends React.Component<FieldGroupProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  renderOptions = () => 
    map(this.props.values, (value, key) => (
      <option key={key} value={key}>{value}</option>
    ))

  render(): React.ReactChild {
    const { label, type, name } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const { touched, errors } = formik;
    return (
      <FormGroup>
        {label && <Label for={name}>{label}</Label>}
        <Field
          name={name}
          render={({ field }: FieldProps) => (
            <Input
              {...field}
              type="select"
              value={field.value || ""}
              valid={isValid(touched, errors, name)}>
              {this.renderOptions()}
            </Input>
          )}
        />
        {errors[name] && <FormFeedback>{errors[name]}</FormFeedback>}
      </FormGroup>
    );
  }
}
