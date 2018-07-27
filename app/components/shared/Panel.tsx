import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";

import * as styles from "./Panel.module.scss";

export interface IPanelProps {
  headerText?: string | React.ReactNode;
  rightComponent?: React.ReactNode;
  icon?: string;
  narrow?: boolean;
}

export const Panel: React.SFC<IPanelProps & CommonHtmlProps> = ({
  headerText,
  rightComponent,
  icon,
  className,
  children,
  narrow,
  ...props
}) => {
  const hasHeader = !!(headerText || rightComponent || icon);

  return (
    <div
      {...props}
      className={cn(styles.panel, className, hasHeader && "has-header", narrow && styles.narrow)}
    >
      {hasHeader && (
        <header className={cn(styles.header, icon && "has-icon")}>
          {icon && <img src={icon} className={styles.icon} />}
          {headerText && <div className={styles.left}>{headerText}</div>}
          {rightComponent && <div className={styles.right}>{rightComponent}</div>}
        </header>
      )}
      {children}
    </div>
  );
};
