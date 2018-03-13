import * as React from "react";
import * as styles from "./TableCell.module.scss";

export interface ITableCell {
  children?: any;
  narrow?: boolean;
  center?: boolean;
}

export const TableCell: React.SFC<ITableCell> = ({ narrow, center, children }) => (
  <div
    className={`${styles.tableCell} ${narrow ? styles.tableCellNarrow : ""} ${
      center ? styles.tableCellCenter : ""
    }`}
  >
    {children}
  </div>
);
