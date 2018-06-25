import * as React from "react";

import { Panel } from "../Panel";
import { PercentageIndicatorBar } from "../PercentageIndicatorBar";
import * as styles from "./EtoFormWrapper.module.scss";

interface IProps {
  title: React.ReactText | React.ReactNode;
  progressPercent: number;
}

export const EtoFormWrapper: React.SFC<IProps> = ({ title, progressPercent, children }) => {
  return (
    <Panel className={styles.panel}>
      <h2 className={styles.title}>{title}</h2>
      <PercentageIndicatorBar className={styles.progressBar} percent={progressPercent} />
      {children}
    </Panel>
  );
};
