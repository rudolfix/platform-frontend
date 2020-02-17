import * as React from "react";

import { TTranslatedString } from "../../types";

import * as styles from "./NomineeDashboard.module.scss";

interface IDashboardTitleProps {
  title: TTranslatedString;
  text?: TTranslatedString;
}

export const DashboardTitleSmall: React.FunctionComponent<IDashboardTitleProps> = ({
  title,
  text,
}) => (
  <div className={styles.dashboardTitleWrapper}>
    <h1 className={styles.dashboardTitleSmall}>{title}</h1>
    {text && <p className={styles.dashboardText}>{text}</p>}
  </div>
);

export const DashboardTitle: React.FunctionComponent<IDashboardTitleProps> = ({ title, text }) => (
  <div className={styles.dashboardTitleWrapper}>
    <h1 className={styles.dashboardTitle}>{title}</h1>
    {text && <p className={styles.dashboardText}>{text}</p>}
  </div>
);
