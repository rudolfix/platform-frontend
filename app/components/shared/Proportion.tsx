import * as cn from "classnames";
import * as React from "react";

import * as styles from "./Proportion.module.scss";

interface IProps {
  height?: number;
  width?: number;
  className?: string;
}

export const Proportion: React.SFC<IProps> = ({ width = 1, height = 1, children, className }) => {
  return (
    <div
      className={cn(styles.proportion, className)}
      style={{ paddingTop: `${height / width * 100}%` }}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
};
