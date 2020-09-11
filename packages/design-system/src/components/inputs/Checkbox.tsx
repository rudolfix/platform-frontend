import { TDataTestId } from "@neufund/shared-utils";
import cn from "classnames";
import { Field, FieldProps, FormikConsumer } from "formik";
import * as React from "react";

import * as styles from "./Checkbox.module.scss";

interface IFieldCheckboxProps {
  label: React.ReactNode | string;
  disabled?: boolean;
  name: string;
}

interface ICheckboxBaseProps {
  label: React.ReactNode | string;
  disabled?: boolean;
  name: string;
  checked: boolean;
  onChange: () => void;
}

export const CheckboxBase: React.FunctionComponent<ICheckboxBaseProps & TDataTestId> = ({
  disabled,
  name,
  checked,
  onChange,
  label,
  "data-test-id": dataTestId,
}) => (
  <label className={cn(styles.wrapper)}>
    <input
      type="checkbox"
      className={styles.input}
      id={name}
      disabled={disabled}
      onChange={onChange}
      checked={checked}
    />

    <span className={styles.checkmark} data-test-id={dataTestId} />

    {label && <span className={styles.label}>{label}</span>}
  </label>
);

export const Checkbox: React.FunctionComponent<IFieldCheckboxProps & TDataTestId> = ({
  name,
  disabled,
  label,
  "data-test-id": dataTestId,
}) => (
  <FormikConsumer>
    {({ setFieldValue }) => (
      <Field
        name={name}
        render={({ field, form }: FieldProps) => {
          const checked = !!form.values[name];

          const onChange = () => {
            setFieldValue(name, !checked);
          };

          return (
            <CheckboxBase
              name={field.name}
              checked={checked}
              onChange={onChange}
              label={label}
              disabled={disabled}
              data-test-id={dataTestId}
            />
          );
        }}
      />
    )}
  </FormikConsumer>
);
