import { Field, FieldProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";

import * as styles from "./FormCheckbox.module.scss";

export type TInputType = "checkbox" | "radio";

interface IProps {
  type: TInputType;
  label: string;
  name: string;
  "data-test-id"?: string;
}

interface IInternalProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<any>) => any;
}

const CheckboxComponent: React.SFC<IProps & IInternalProps> = ({
  type,
  name,
  label,
  "data-test-id": dataTestId,
}) => {
  return (
    <label className={styles.checkbox}>
      <input className={styles.input} type={type} name={name} data-test-id={dataTestId} />
      <div className={styles.indicator} />
      <div className={styles.label}>{label}</div>
    </label>
  );
};

export class FormCheckbox extends React.Component<IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    const { name } = this.props;

    return (
      // TODO: add here form label + form validation if needed
      <Field
        name={name}
        render={({ field }: FieldProps) => <CheckboxComponent {...this.props} {...field} />}
      />
    );
  }
}
