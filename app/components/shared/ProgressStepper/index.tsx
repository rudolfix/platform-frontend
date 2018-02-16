import * as React from "react";

import * as cn from "classnames";
import { times } from "lodash";
import * as styles from "./styles.module.scss";

const DOT_DISTANCE = 50;

interface IProps {
  steps: number;
  currentStep: number;
}

export const ProgressStepper = (props: IProps) => {
  const stepSize = 100 / (props.steps - 1);

  const dots = times(props.steps, i => (
    <div
      key={i}
      className={cn({ [styles.dot]: true, [styles.dotActive]: i < props.currentStep })}
      style={{ left: `${stepSize * i}%` }}
    />
  ));

  return (
    <div className={styles.progressStepper} style={{ width: DOT_DISTANCE * (props.steps - 1) }}>
      <div className={styles.progressBackground} />
      <div
        className={styles.progressBar}
        style={{ width: `${(props.currentStep - 1) / (props.steps - 1) * 100}%` }}
      />
      {dots}
    </div>
  );
};
