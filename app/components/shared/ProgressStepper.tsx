import * as React from "react";

import * as cn from "classnames";
import { range } from "lodash";
import * as styles from "./ProgressStepper.module.scss";

export interface IProgresStepper {
  steps: number;
  currentStep: number;
}

export const ProgressStepper: React.SFC<IProgresStepper> = ({ steps, currentStep }) => (
  <div className={styles.progressStepper}>
    {range(steps).map(number => (
      <div key={number} className={cn(styles.step, number < currentStep && styles.active)} />
    ))}
  </div>
);
