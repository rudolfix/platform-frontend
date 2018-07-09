import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";
import { invariant } from "../../utils/invariant";

import * as styles from "./PercentageIndicatorBar.module.scss";

type IProps =
  | {
      percent: number;
      fraction?: number;
    }
  | {
      percent?: number;
      fraction: number;
    };

const CURVE = 20;

export function selectPercentage(props: IProps): number {
  if (props.percent !== undefined) {
    return props.percent;
  }

  if (props.fraction !== undefined) {
    return props.fraction * 100;
  }

  invariant(false, "You need to provide percent or fraction to PercentageIndicatorBar component");
  return 1;
}

/**
 * Takes either percentage value or fraction. Makes sure that % is rounded to the nearest integer.
 */
export const PercentageIndicatorBar: React.SFC<IProps & CommonHtmlProps> = props => {
  const { percent: _percent, fraction: _fraction, ...htmlProps } = props;
  const percent = Math.round(selectPercentage(props));

  return (
    <div {...htmlProps} className={cn(styles.percentageIndicatorBar, htmlProps.className)}>
      <span className={styles.label} data-test-id="percentage-indicator-bar-value">
        {percent}%
      </span>
      <svg width="100%" height="38">
        <defs>
          <clipPath id="percent-indicator-bar">
            <rect width="100%" height="38" rx={CURVE} ry={CURVE} />
          </clipPath>
        </defs>
        <g clipPath="url(#percent-indicator-bar)">
          <rect className={styles.background} height="100%" rx={CURVE} ry={CURVE} />
          <rect
            className={styles.progress}
            width="100%"
            height="100%"
            rx={CURVE}
            ry={CURVE}
            style={{ transform: `translateX(${percent - 100}%)` }}
          />
        </g>
      </svg>
    </div>
  );
};
