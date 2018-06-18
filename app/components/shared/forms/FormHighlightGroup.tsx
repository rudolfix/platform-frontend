import * as React from "react";

import * as styles from "./FormHighlightGroup.module.scss";

export const FormHighlightGroup: React.SFC = ({ children }) => {
  return <div className={styles.formHighlightGroup}>{children}</div>;
};
