import { Field, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";

import * as styles from "./FormCheckbox.module.scss";

export type TInputType = "checkbox" | "radio";

interface IProps {
  type: TInputType;
  label: string;
  name: string;
  value?: string;
  checked: boolean;
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
  value,
  checked,
  onChange,
  "data-test-id": dataTestId,
}) => {
  return (
    <label className={styles.checkbox}>
      <input
        onChange={onChange}
        className={styles.input}
        type={type}
        name={name}
        defaultChecked={checked}
        value={value}
        data-test-id={dataTestId}
      />
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
    const { name, value, type } = this.props;
    const { setFieldValue } = this.context.formik as FormikProps<any>;

    const setValue = (e: React.ChangeEvent<any>, name: string, value: any) => {
      if (type === "radio") {
        setFieldValue(name, value);
        return;
      }

      if (e.target.checked) {
        setFieldValue(name, true);
      } else {
        setFieldValue(name, false);
      }
    };

    return (
      <Field
        name={name}
        render={({ field }: FieldProps) => (
          <CheckboxComponent {...this.props} {...field} onChange={e => setValue(e, name, value)} />
        )}
      />
    );
  }
}
