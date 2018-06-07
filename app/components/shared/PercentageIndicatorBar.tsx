import * as cn from "classnames";
import * as React from "react";
import { CommonHtmlProps } from "../../types";
import * as styles from "./PercentageIndicatorBar.module.scss";

interface IProps {
  percent: number;
}

const CURVE = 20;

export const PercentageIndicatorBar: React.SFC<IProps & CommonHtmlProps> = ({
  percent,
  ...htmlProps
}) => {
  return (
    <div {...htmlProps} className={cn(styles.percentageIndicatorBar, htmlProps.className)}>
      <span className={styles.label}>{percent}%</span>
      <svg width="100%" height="38">
        <rect className={styles.background} width="100%" height="100%" rx={CURVE} ry={CURVE} />
        <rect
          className={styles.progress}
          width={`${percent}%`}
          height="100%"
          rx={CURVE}
          ry={CURVE}
        />
      </svg>
    </div>
  );
};
