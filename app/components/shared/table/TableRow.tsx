import * as React from "react";
import * as styles from "./TableRow.module.scss";

export interface ITableRow {
  children?: React.ReactNode;
}

export const TableRow: React.SFC<ITableRow> = ({ children }) => (
  <div className={styles.tableRow}>{children}</div>
);
