import { Field, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";

import * as styles from "./FormCheckbox.module.scss";

interface IProps {
  inputId?: string;
  name: string;
  label?: string | React.ReactNode;
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  "data-test-id"?: string;
}

interface IInternalProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const CheckboxComponent: React.SFC<IProps & IInternalProps> = ({
  name,
  label,
  value,
  onChange,
  checked,
  disabled,
  inputId,
  "data-test-id": dataTestId,
}) => {
  return (
    <label className={styles.checkbox}>
      <input
        id={inputId}
        className={styles.input}
        onChange={onChange}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        data-test-id={dataTestId}
        disabled={disabled}
      />
      <div className={styles.indicator} />
      {label && <div className={styles.label}>{label}</div>}
    </label>
  );
};

const RadioButtonComponent: React.SFC<IProps & IInternalProps> = ({
  name,
  label,
  value,
  onChange,
  checked,
  disabled,
  "data-test-id": dataTestId,
}) => {
  return (
    <label className={styles.checkbox}>
      <input
        className={styles.input}
        disabled={disabled}
        onChange={onChange}
        type="radio"
        name={name}
        value={value}
        defaultChecked={checked}
        data-test-id={dataTestId}
      />
      <div className={styles.indicator} />
      {label && <div className={styles.label}>{label}</div>}
    </label>
  );
};

export class FormCheckbox extends React.Component<IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    const { name, checked, disabled } = this.props;
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;

    return (
      <Field
        name={name}
        render={({ field }: FieldProps) => {
          return (
            <CheckboxComponent
              {...this.props}
              {...field}
              checked={checked || values[name]}
              onChange={() => setFieldValue(name, !values[name])}
              disabled={disabled}
            />
          );
        }}
      />
    );
  }
}

export class FormRadioButton extends React.Component<IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    const { name, checked, disabled } = this.props;
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;

    return (
      <Field
        name={name}
        render={({ field }: FieldProps) => {
          const { name } = field;
          const { value } = this.props;

          return (
            <RadioButtonComponent
              {...this.props}
              {...field}
              checked={checked || values[name] === value}
              onChange={() => setFieldValue(name, value)}
              disabled={disabled}
            />
          );
        }}
      />
    );
  }
}
