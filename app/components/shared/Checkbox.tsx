import * as React from "react";

import * as styles from "./Checkbox.module.scss";

export type TInputType = "checkbox" | "radio";

interface ICheckbox {
  type: TInputType;
  label: string;
  "data-test-id"?: string;
}

export const Checkbox: React.SFC<ICheckbox & Partial<HTMLInputElement>> = ({
  id,
  type,
  name,
  label,
  "data-test-id": dataTestId,
}) => {
  return (
    <label htmlFor={id} className={styles.checkbox}>
      <input className={styles.input} type={type} id={id} name={name} data-test-id={dataTestId} />
      <div className={styles.indicator} />
      <div className={styles.label}>{label}</div>
    </label>
  );
};
