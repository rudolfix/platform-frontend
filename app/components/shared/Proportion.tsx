import * as React from "react";

import * as styles from "./Proportion.module.scss";

interface IProps {
  height?: number;
  width?: number;
}

export const Proportion: React.SFC<IProps> = ({ width = 1, height = 1, children }) => {
  return (
    <div className={styles.proportion} style={{ paddingTop: `${width / height * 100}%` }}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
