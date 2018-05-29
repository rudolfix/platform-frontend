import * as React from "react";
import { FormattedMessage } from "react-intl";

import * as styles from "./Range.module.scss";

type TStep = "any" | number;
type TUnit = string | React.ReactNode | undefined;
interface IProps {
  min: number;
  max: number;
  name: string;
  value?: number;
  unit?: TUnit;
  unitMin?: TUnit;
  unitMax?: TUnit;
  step?: TStep;
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

export class Range extends React.Component<IProps> {
  state = {
    value: 0,
  };

  handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    this.setState({ value });
  };

  componentWillMount(): void {
    const computedValue =
      this.props.value && this.props.value > this.props.max ? this.props.max : this.props.value;
    const value = computedValue || this.props.min + (this.props.max - this.props.min) / 2;

    this.setState({ value });
  }

  render(): React.ReactNode {
    const { name, unit, unitMin, unitMax, min, max, step } = this.props;
    const { value } = this.state;

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
          onChange={this.handleInput}
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
  }
}
