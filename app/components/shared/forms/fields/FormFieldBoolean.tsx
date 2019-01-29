import * as cn from "classnames";
import { Field, FieldProps } from "formik";
import * as React from "react";

import { FormFieldError } from "./FormFieldError";

import * as styles from "./FormFieldBoolean.module.scss";

interface IProps {
  inputId?: string;
  name: string;
  label?: string | React.ReactNode;
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  inputRef?: (el: HTMLInputElement | null) => void;
  "data-test-id"?: string;
}

interface IInternalProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const CheckboxLayout: React.FunctionComponent<IProps & IInternalProps> = ({
  name,
  label,
  value = "true",
  onChange,
  checked,
  disabled,
  inputId,
  inputRef,
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
        ref={inputRef}
      />
      <div className={cn(styles.indicator, disabled && styles.disabled)} />
      {label && <div className={styles.label}>{label}</div>}
    </label>
  );
};

const RadioButtonLayout: React.FunctionComponent<IProps & IInternalProps> = ({
  name,
  label,
  value = "true",
  onChange,
  checked,
  disabled,
  inputRef,
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
        ref={inputRef}
      />
      <div className={cn(styles.indicator, disabled && styles.disabled)} />
      {label && <div className={styles.label}>{label}</div>}
    </label>
  );
};

/*
 * Conditional checkbox.
 * Use when there is a need to represent true/false value (checked === true).
 * If array of values is needed use FormFieldCheckboxGroup
 */
class FormFieldBoolean extends React.Component<IProps> {
  render(): React.ReactNode {
    const { name, checked, disabled } = this.props;

    return (
      <Field
        name={name}
        render={({ field, form }: FieldProps) => {
          return (
            <>
              <CheckboxLayout
                {...field}
                {...this.props}
                checked={checked || form.values[name]}
                onChange={() => form.setFieldValue(name, !form.values[name])}
                disabled={disabled}
              />
              <FormFieldError name={name} className="text-left" />
            </>
          );
        }}
      />
    );
  }
}

class FormRadioButton extends React.Component<IProps> {
  render(): React.ReactNode {
    const { name, checked, disabled } = this.props;

    return (
      <Field
        name={name}
        render={({ field, form }: FieldProps) => {
          const { value } = this.props;

          return (
            <RadioButtonLayout
              {...field}
              {...this.props}
              checked={checked || form.values[name] === value}
              onChange={() => form.setFieldValue(name, value)}
              disabled={disabled}
            />
          );
        }}
      />
    );
  }
}

export { RadioButtonLayout, FormRadioButton, FormFieldBoolean, CheckboxLayout };
