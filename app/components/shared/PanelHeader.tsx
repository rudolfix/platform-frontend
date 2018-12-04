import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../types";

import * as styles from "./Panel.module.scss";

export interface IPanelHeaderProps extends CommonHtmlProps {
  headerText?: TTranslatedString;
  rightComponent?: React.ReactNode;
  icon?: string;
}

const PanelHeader: React.SFC<IPanelHeaderProps> = ({ headerText, rightComponent, icon }) => {
  return (
    <header className={cn(styles.header, { [styles.hasIcon]: !!(icon || !headerText) })}>
      {icon && <img src={icon} className={styles.icon} alt="" />}
      {headerText && <div className={styles.left}>{headerText}</div>}
      {rightComponent && <div className={styles.right}>{rightComponent}</div>}
    </header>
  );
};

export { PanelHeader };
