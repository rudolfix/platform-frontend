import * as React from "react";

import * as styles from "./ViewSubHeaderPanel.module.scss";

export const ViewSubHeaderPanel: React.SFC = ({ children }) => {
  return <div className={styles.viewSubHeaderPanel}>{children}</div>;
};
