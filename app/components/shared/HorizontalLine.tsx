import * as cn from "classnames";
import * as React from "react";

import * as styles from "./HorizontalLine.module.scss";

type TSize = "narrow" | "wide";

type TTheme = "yellow";

interface IHorizontalLineProps {
  className?: string;
  size?: TSize;
  theme?: TTheme;
}

export const HorizontalLine: React.SFC<IHorizontalLineProps> = ({ className, size, theme }) => (
  <div className={cn(styles.horizontalLine, className, size, theme)} />
);

HorizontalLine.defaultProps = {
  size: "wide",
};
