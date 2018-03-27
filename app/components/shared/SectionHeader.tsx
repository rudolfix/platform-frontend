import * as React from "react";
import * as styles from "./SectionHeader.module.scss";

export const SectionHeader: React.SFC = ({ children }) => (
  <h3 className={styles.sectionHeader}>{children}</h3>
);
