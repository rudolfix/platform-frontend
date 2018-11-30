import { connect as formikConnect, Field, FieldProps, FormikContext } from "formik";
import { includes } from "lodash";
import * as React from "react";
import { compose } from "recompose";

import { CheckboxLayout } from "./FormCheckbox";
import { IFormField, withFormField } from "./utils";

interface IFormFieldCheckboxGroupProps {
  name: string;
}

interface IFormFieldCheckboxProps {
  value: string;
  label: string;
  disabled?: boolean;
}

const toggle = (values: string[], valueToToggle: string): string[] => {
  const alreadyExists = includes(values, valueToToggle);

  if (alreadyExists) {
    return values.filter(v => v !== valueToToggle);
  } else {
    return [...values, valueToToggle];
  }
};

const FormFieldNameContext = React.createContext("FORM FIELD UNKNOWN");

class FormFieldCheckbox extends React.Component<IFormFieldCheckboxProps> {
  render(): React.ReactNode {
    const { value, label, disabled, ...restProps } = this.props;

    return (
      <FormFieldNameContext.Consumer>
        {fieldName => (
          <Field
            name={fieldName}
            render={({ field, form }: FieldProps) => (
              <CheckboxLayout
                {...restProps}
                name={fieldName}
                disabled={disabled}
                label={label}
                value={value}
                checked={includes(field.value, value)}
                onChange={() => form.setFieldValue(fieldName, toggle(field.value, value))}
              />
            )}
          />
        )}
      </FormFieldNameContext.Consumer>
    );
  }
}

class FormFieldCheckboxGroupLayout extends React.Component<
  IFormFieldCheckboxGroupProps & {
    formik: FormikContext<any>;
  }
> {
  componentWillMount(): void {
    this.setDefaultValueIfNeeded();
  }

  private setDefaultValueIfNeeded(): void {
    const { name, formik } = this.props;
    const { setFieldValue } = formik;
    const value = formik.values[name];

    if (value === undefined) {
      setFieldValue(this.props.name, []);
    }
  }

  render(): React.ReactNode {
    const { name, children } = this.props;

    return (
      <FormFieldNameContext.Provider value={name}>
        <div>{children}</div>
      </FormFieldNameContext.Provider>
    );
  }
}

const FormFieldCheckboxGroup = compose<
  IFormFieldCheckboxGroupProps & {
    formik: FormikContext<any>;
  },
  IFormField
>(
  withFormField,
  formikConnect,
)(FormFieldCheckboxGroupLayout);

export { FormFieldCheckbox, FormFieldCheckboxGroup, IFormFieldCheckboxGroupProps };
