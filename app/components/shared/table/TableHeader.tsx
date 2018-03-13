import * as React from "react";
import * as styles from "./TableHeader.module.scss";

interface ITableHeaderProps {
  children: React.ReactNode;
}

export const TableHeader: React.SFC<ITableHeaderProps> = ({ children }) => (
  <div className={styles.tableHeader}>{children}</div>
);
