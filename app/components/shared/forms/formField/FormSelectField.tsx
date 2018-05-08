import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import { map, mapValues } from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, Input, Label } from "reactstrap";

import { isNonValid } from "../forms";

import * as styles from "./FormStyles.module.scss";

export const NONE_KEY = "__NONE__";
export const BOOL_TRUE_KEY = "true";
export const BOOL_FALSE_KEY = "false";

export const boolify = <T extends {}>(values: T): T => {
  if (!values) return values;
  const v: any = values;
  return mapValues(v, key => {
    if (key === BOOL_TRUE_KEY) return true;
    if (key === BOOL_FALSE_KEY) return false;
    return key;
  }) as T;
};

export const unboolify = <T extends {}>(values: T): T => {
  if (!values) return values;
  const v: any = values;
  return mapValues(v, key => {
    if (key === true) return BOOL_TRUE_KEY;
    if (key === false) return BOOL_FALSE_KEY;
    return key;
  }) as T;
};

interface IOwnProps {
  extraMessage?: string | React.ReactNode;
}
interface IFieldGroup {
  label?: string | React.ReactNode;
  values: {
    [key: string]: string | React.ReactNode;
  };
  disabledValues?: {
    [key: string]: boolean;
  };
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

export class FormSelectField extends React.Component<FieldGroupProps & IOwnProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  renderOptions = () =>
    map(this.props.values, (value, key) => (
      <option
        key={key}
        value={key}
        disabled={this.props.disabledValues && this.props.disabledValues[key]}
      >
        {value}
      </option>
    ));

  render(): React.ReactChild {
    const { label, name, extraMessage } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const { touched, errors, setFieldTouched } = formik;
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
            <Input
              {...field}
              onFocus={() => setFieldTouched(name, true)}
              type="select"
              value={field.value}
              valid={isValid(touched, errors, name)}
              {...inputExtraProps}
            >
              {this.renderOptions()}
            </Input>
          )}
        />
        {extraMessage ? (
          <div className={styles.noteLabel}>{extraMessage}</div>
        ) : (
          <div className={styles.errorLabel}>
            {isNonValid(touched, errors, name) && <div>{errors[name]}</div>}
          </div>
        )}
      </FormGroup>
    );
  }
}
