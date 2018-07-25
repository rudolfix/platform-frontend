import { Field, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";

import * as styles from "./Toggle.module.scss";

interface IProps {
  disabledLabel: string | React.ReactNode;
  enabledLabel: string | React.ReactNode;
  name: string;
  disabled?: boolean;
  trueValue?: any;
  falseValue?: any;
  "data-test-id"?: string;
}

interface IInternalProps {
  value: boolean;
  onChange: (a: React.ChangeEvent<any>) => any;
}

export const ToggleComponent: React.SFC<IProps & IInternalProps> = ({
  disabledLabel,
  enabledLabel,
  onChange,
  value,
  name,
  disabled,
  "data-test-id": dataTestId,
}) => {
  return (
    <div className={styles.toggle}>
      <div>{disabledLabel}</div>
      <label className={styles.toggleWrapper}>
        <input
          name={name}
          className={styles.input}
          type="checkbox"
          onChange={onChange}
          checked={value}
          disabled={disabled}
          data-test-id={dataTestId}
        />
        <div className={styles.track}>
          <div className={styles.indicator} />
        </div>
      </label>
      <div>{enabledLabel}</div>
    </div>
  );
};

export class FormToggle extends React.Component<IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  static defaultProps = {
    trueValue: true,
    falseValue: false,
  };

  componentWillMount(): void {
    this.setDefaultValueIfNeeded();
  }

  private setDefaultValueIfNeeded(): void {
    const { name, falseValue } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const value = formik.values[name];

    if (value === undefined) {
      formik.setFieldValue(this.props.name, falseValue);
    }
  }

  private onChange = (e: React.ChangeEvent<any>) => {
    const { trueValue, falseValue } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const isChecked = e.target.checked;

    const finalValue = isChecked ? trueValue : falseValue;

    formik.setFieldValue(this.props.name, finalValue);
  };

  render(): React.ReactNode {
    const { name, trueValue } = this.props;

    return (
      <Field
        name={name}
        render={({ field }: FieldProps) => (
          <ToggleComponent
            {...this.props}
            {...field}
            value={field.value === trueValue}
            onChange={this.onChange}
          />
        )}
      />
    );
  }
}
