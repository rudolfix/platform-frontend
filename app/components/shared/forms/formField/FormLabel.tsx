import * as React from "react";

import * as styles from "./FormLabel.module.scss";

export const FormLabel: React.SFC = ({ children }) => {
  return <div className={styles.formLabel}>{children}</div>;
};
