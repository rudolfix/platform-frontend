import { Field, FieldProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import * as styles from "./Range.module.scss";

type TStep = "any" | number;
type TUnit = string | React.ReactNode | undefined;

interface IProps {
  min: number;
  max: number;
  name: string;
  unit?: TUnit;
  unitMin?: TUnit;
  unitMax?: TUnit;
  step?: TStep;
}

interface IInternalProps {
  value: number;
  onChange: any;
}

interface IRangeLabelProps {
  label: string | React.ReactNode;
  value: number;
  unit: TUnit;
}

const RangeLabel: React.SFC<IRangeLabelProps> = ({ label, value, unit }) => (
  <div className={styles.label}>
    <div>{label}</div>
    <div className={styles.labelDetails}>
      {value} {unit}
    </div>
  </div>
);

export const RangeComponent: React.SFC<IProps & IInternalProps> = props => {
  const { name, unit, unitMin, unitMax, min, max, step, onChange, value } = props;

  return (
    <div className={styles.range}>
      <RangeLabel
        label={<FormattedMessage id="shared-component.range.min" />}
        value={min}
        unit={unitMin || unit}
      />
      <input
        name={name}
        value={value}
        min={min}
        max={max}
        step={step || 1}
        className={styles.input}
        type="range"
        onChange={onChange}
      />
      <RangeLabel
        label={<FormattedMessage id="shared-component.range.max" />}
        value={max}
        unit={unitMax || unit}
      />
      <div className={styles.currentValue}>
        {value} {unitMin && unitMax ? (value > 1 ? unitMax : unitMin) : unit}
      </div>
    </div>
  );
};

export class FormRange extends React.Component<IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    const { name } = this.props;

    return (
      // TODO: add here form label + form validation if needed
      <Field
        name={name}
        render={({ field }: FieldProps) => (
          <RangeComponent {...field} value={field.value} {...this.props} />
        )}
      />
    );
  }
}
