import * as cn from "classnames";
import * as React from "react";

import { Size } from "../../types";

import * as styles from "./HorizontalLine.module.scss";

type TTheme = "yellow";

interface IHorizontalLineProps {
  className?: string;
  size?: Size;
  theme?: TTheme;
}

export const HorizontalLine: React.SFC<IHorizontalLineProps> = ({ className, size, theme }) => (
  <div className={cn(styles.horizontalLine, className, size, theme)} />
);

HorizontalLine.defaultProps = {
  size: "wide",
};
