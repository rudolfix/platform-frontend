import * as cn from "classnames";
import * as React from "react";

import * as styles from "./ChartCircle.module.scss";

export interface IChartCircleProps {
  progress: number;
  name: string | React.ReactNode;
}

export const ChartCircle: React.SFC<IChartCircleProps> = ({ progress, name }) => {
  const viewBoxSize = 220;
  const radius = viewBoxSize / 2;
  const indicatorRadius = radius * 0.8;
  const indicatorCircumference = indicatorRadius * 2 * Math.PI;
  const svgCenter = viewBoxSize / 2;
  const precisionDigit = 3;

  return (
    <div className={cn(styles.chartCircle, progress === 1 && "is-completed")}>
      <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        <circle className={styles.border} r={svgCenter - 2} cx={svgCenter} cy={svgCenter} />
        <circle className={styles.indicator} r={indicatorRadius} cx={svgCenter} cy={svgCenter} />
        <path
          className={styles.progress}
          d={`M${svgCenter} ${radius - indicatorRadius}
          a ${indicatorRadius} ${indicatorRadius} 0 0 1 0 ${indicatorRadius * 2}
          a ${indicatorRadius} ${indicatorRadius} 0 0 1 0 ${indicatorRadius * -2}`}
          strokeDasharray={`${progress * indicatorCircumference}, ${indicatorCircumference}`}
        />
      </svg>
      <div className={styles.labels}>
        <div className={styles.percents}>{`${(progress * 100).toPrecision(precisionDigit)}%`}</div>
        <div className={styles.name}>{name}</div>
      </div>
    </div>
  );
};
