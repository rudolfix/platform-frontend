import * as cn from "classnames";
import * as React from "react";

import * as styles from "./Proportion.module.scss";

interface IProps {
  height?: number;
  width?: number;
}

export const Proportion: React.SFC<IProps> = ({ width = 1, height = 1, children }) => {
  return (
    <div
      className={cn("proportion", styles.proportion)}
      style={{ paddingTop: `${height / width * 100}%` }}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
};
