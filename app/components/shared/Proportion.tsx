import * as cn from "classnames";
import * as React from "react";

import * as styles from "./Proportion.module.scss";

interface IProps {
  height?: number;
  width?: number;
  className?: string;
  disabledOnMobile?: boolean;
}

export const Proportion: React.SFC<IProps> = ({
  width = 1,
  height = 1,
  disabledOnMobile,
  children,
  className,
}) => {
  return (
    <div
      className={cn(styles.proportion, className, disabledOnMobile && styles.disabledOnMobile)}
      style={{ paddingTop: `${height / width * 100}%` }}
    >
      <div className={cn(styles.content, "c-proportion-content")}>{children}</div>
    </div>
  );
};
