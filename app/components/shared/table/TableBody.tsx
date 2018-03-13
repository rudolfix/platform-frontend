import * as React from "react";
import * as styles from "./TableBody.module.scss";

interface ITableBody {
  children?: React.ReactNode;
}

export const TableBody: React.SFC<ITableBody> = ({ children }) => (
  <div className={styles.tableBody}>{children}</div>
);
