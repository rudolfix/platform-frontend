import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";
import { invariant } from "../../utils/invariant";

import * as styles from "./PercentageIndicatorBar.module.scss";

type TLayout = "narrow";

type TTheme = "green";

interface ICommonProps {
  layout?: TLayout;
  theme?: TTheme;
}

type TProps =
  | {
      percent: number;
      fraction?: number;
    }
  | {
      percent?: number;
      fraction: number;
      layout?: TLayout;
    };

type IProps = ICommonProps & TProps;

const DEFAULT_CURVE = 20;
const NARROW_CURVE = 5;

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

  const isNarrow = props.layout === "narrow";
  const computedCurve = isNarrow ? NARROW_CURVE : DEFAULT_CURVE;
  const computedHeight = isNarrow ? 10 : 38;

  return (
    <div
      {...htmlProps}
      className={cn(styles.percentageIndicatorBar, htmlProps.className, props.theme)}
    >
      {!isNarrow && (
        <span className={styles.label} data-test-id="percentage-indicator-bar-value">
          {percent}%
        </span>
      )}
      <svg width="100%" height={computedHeight}>
        <defs>
          <clipPath id="percent-indicator-bar">
            <rect width="100%" height={computedHeight} rx={computedCurve} ry={computedCurve} />
          </clipPath>
        </defs>
        <g clipPath="url(#percent-indicator-bar)">
          <rect className={styles.background} height="100%" rx={computedCurve} ry={computedCurve} />
          <rect
            className={styles.progress}
            width="100%"
            height="100%"
            rx={computedCurve}
            ry={computedCurve}
            style={{ transform: `translateX(${percent - 100}%)` }}
          />
        </g>
      </svg>
    </div>
  );
};
