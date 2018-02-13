import * as cn from "classnames";
import * as React from "react";

import * as styles from "./HorizontalLine.module.scss";

interface IHorizontalLineProps {
  className?: string;
}

export const HorizontalLine: React.SFC<IHorizontalLineProps> = ({ className }) => (
  <div className={cn(styles.horizontalLine, className)} />
);
