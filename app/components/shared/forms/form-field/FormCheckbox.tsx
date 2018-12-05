import * as cn from "classnames";
import { Field, FieldProps } from "formik";
import * as React from "react";

import * as styles from "./FormCheckbox.module.scss";
import { FormError } from "./FormError";

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

const CheckboxLayout: React.SFC<IProps & IInternalProps> = ({
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

const RadioButtonLayout: React.SFC<IProps & IInternalProps> = ({
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
 * @todo Rename to FormFieldConditional (or something better) as FormCheckbox can be misleading with FormFieldCheckbox
 */
class FormCheckbox extends React.Component<IProps> {
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
              <FormError name={name} className="text-left" />
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

export { RadioButtonLayout, FormRadioButton, FormCheckbox, CheckboxLayout };
