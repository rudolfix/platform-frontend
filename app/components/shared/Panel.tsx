import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";

import * as styles from "./Panel.module.scss";

export interface IPanelProps {
  headerText?: string | React.ReactNode;
  rightComponent?: React.ReactNode;
  icon?: string;
}

export const Panel: React.SFC<IPanelProps & CommonHtmlProps> = ({
  headerText,
  rightComponent,
  icon,
  className,
  children,
  ...props
}) => {
  const hasHeader = !!(headerText || rightComponent || icon);

  return (
    <div {...props} className={cn(styles.panel, className)}>
      {hasHeader && (
        <header className={styles.header}>
          {headerText && <div className={styles.left}>{headerText}</div>}
          {(rightComponent || icon) && (
            <div className={styles.right}>
              {rightComponent}
              {icon && <img src={icon} className={styles.icon} />}
            </div>
          )}
        </header>
      )}
      {children}
    </div>
  );
};
