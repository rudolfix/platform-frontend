import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";

import * as styles from "./PercentageIndicatorBar.module.scss";

type TLayout = "narrow";

type TTheme = "green";

interface ICommonProps {
  layout?: TLayout;
  theme?: TTheme;
}

type TProps = {
  percent?: number;
  progress?: TProgressBarProps[];
  renderProgressBar?: () => React.ReactNode;
  svgGroupStyle?: React.SVGProps<SVGGElement>;
  svgHeight?: number;
};

type IProps = ICommonProps & TProps;

const DEFAULT_CURVE = 20;
const NARROW_CURVE = 5;

type TProgressBarExternalProps = {
  theme?: TTheme;
  progress?: number;
  withoutRadius?: boolean;
};

type TProgressBarProps = TProgressBarExternalProps & CommonHtmlProps;

const PercentageIndicatorContext = React.createContext({
  computedHeight: 0,
  computedCurve: 0,
});

const BackgroundBar: React.SFC<CommonHtmlProps> = ({ className, style }) => (
  <PercentageIndicatorContext.Consumer>
    {({ computedHeight, computedCurve }) => (
      <rect
        className={cn(styles.background, className)}
        height={computedHeight}
        rx={computedCurve}
        ry={computedCurve}
        style={style}
      />
    )}
  </PercentageIndicatorContext.Consumer>
);

const ProgressBar: React.SFC<TProgressBarProps> = ({
  theme,
  style,
  withoutRadius = false,
  progress = 100,
}) => (
  <PercentageIndicatorContext.Consumer>
    {({ computedHeight, computedCurve }) => (
      <rect
        className={cn(styles.progress, { [styles.progressGreen]: theme === "green" })}
        width={`${progress}%`}
        height={computedHeight}
        rx={withoutRadius ? 0 : computedCurve}
        ry={withoutRadius ? 0 : computedCurve}
        style={style}
      />
    )}
  </PercentageIndicatorContext.Consumer>
);

/**
 * Takes either percentage value or fraction. Makes sure that % is rounded to the nearest integer.
 */
const PercentageIndicatorBar: React.SFC<IProps & CommonHtmlProps> = ({
  percent,
  progress,
  theme,
  layout,
  children,
  svgGroupStyle,
  svgHeight,
  ...htmlProps
}) => {
  const isNarrow = layout === "narrow";
  const computedCurve = isNarrow ? NARROW_CURVE : DEFAULT_CURVE;
  const computedHeight = isNarrow ? 10 : 38;

  return (
    <PercentageIndicatorContext.Provider value={{ computedHeight, computedCurve }}>
      <div {...htmlProps} className={cn(styles.percentageIndicatorBar, htmlProps.className, theme)}>
        {!isNarrow && (
          <span className={styles.label} data-test-id="percentage-indicator-bar-value">
            {Math.round(percent!)}%
          </span>
        )}
        <svg width="100%" height={svgHeight || computedHeight}>
          <defs>
            <clipPath id="percent-indicator-bar">
              <rect width="100%" height={computedHeight} rx={computedCurve} ry={computedCurve} />
            </clipPath>
          </defs>
          <g {...svgGroupStyle}>
            <g clipPath="url(#percent-indicator-bar)">
              <BackgroundBar />

              {progress ? (
                progress.map((progressProps, i) => <ProgressBar key={i} {...progressProps} />)
              ) : (
                <ProgressBar style={{ transform: `translateX(${percent! - 100}%)` }} />
              )}
            </g>
            {children}
          </g>
        </svg>
      </div>
    </PercentageIndicatorContext.Provider>
  );
};

export { PercentageIndicatorBar, ProgressBar, TProgressBarProps };
