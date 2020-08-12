import * as React from "react";

import * as styles from "./VotingStateWidget.module.scss";

export enum EVotingStateLayout {
  SUCCESS = "success",
  WAITING = "waiting",
  FAILED = "failed",
}

const VotingStateWidget: React.FunctionComponent<{
  children: React.ReactNode;
  layout: EVotingStateLayout;
}> = ({ children, layout }) => <div className={styles[layout]}> {children}</div>;

export { VotingStateWidget };
