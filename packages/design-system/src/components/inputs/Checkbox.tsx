import { TDataTestId } from "@neufund/shared";
import * as cn from "classnames";
import { Field, FieldProps, FormikConsumer } from "formik";
import * as React from "react";

import * as styles from "./Checkbox.module.scss";

interface IFieldCheckboxProps {
  label: React.ReactNode | string;
  disabled?: boolean;
  name: string;
}

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
            <div className={cn(styles.wrapper, { [styles.disabled]: disabled })}>
              <input
                type="checkbox"
                className={styles.input}
                id={field.name}
                disabled={disabled}
                onChange={onChange}
                checked={checked}
              />
              <span className={styles.checkmark} onClick={onChange} data-test-id={dataTestId} />
              <label htmlFor={name} className={styles.label}>
                {label}
              </label>
            </div>
          );
        }}
      />
    )}
  </FormikConsumer>
);
