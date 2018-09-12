import { Field, FormikProps } from "formik";
import { includes } from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";

import { CheckboxComponent } from "./FormCheckbox";

interface IFormFieldCheckboxGroupProps {
  name: string;
}

export class FormFieldCheckboxGroup extends React.Component<IFormFieldCheckboxGroupProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  componentWillMount(): void {
    this.setDefaultValueIfNeeded();
  }

  private setDefaultValueIfNeeded(): void {
    const { name } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const value = formik.values[name];

    if (value === undefined) {
      formik.setFieldValue(this.props.name, []);
    }
  }

  render(): React.ReactNode {
    const { name, children } = this.props;

    return <FormFieldNameContext.Provider value={name}>{children}</FormFieldNameContext.Provider>;
  }
}

interface IFormFieldCheckboxProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export class FormFieldCheckbox extends React.Component<IFormFieldCheckboxProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    const { value, label, disabled, ...restProps } = this.props;
    const { setFieldValue } = this.context.formik as FormikProps<any>;

    return (
      <FormFieldNameContext.Consumer>
        {fieldName => (
          <Field
            name={fieldName}
            render={({ field }) => (
              <CheckboxComponent
                {...restProps}
                name={fieldName}
                disabled={disabled}
                label={label}
                value={value}
                checked={includes(field.value, value)}
                onChange={() => setFieldValue(fieldName, this.toggle(field.value, value))}
              />
            )}
          />
        )}
      </FormFieldNameContext.Consumer>
    );
  }

  private toggle(values: string[], valueToToggle: string): string[] {
    const alreadyExists = includes(values, valueToToggle);

    if (alreadyExists) {
      return values.filter(v => v !== valueToToggle);
    } else {
      return [...values, valueToToggle];
    }
  }
}

const FormFieldNameContext = React.createContext("FORM FIELD UNKNOWN");
