import * as cn from "classnames";
import { uniqueId } from "lodash";
import * as React from "react";

import { TTranslatedString } from "../../types";
import * as styles from "./NewTable.module.scss";
import { Panel } from "./Panel";

interface INewTableHeader {
  titles: (TTranslatedString | React.ReactNode)[];
}

interface INewTableRow {
  children: React.ReactNode[];
}

interface INewTable {
  children: React.ReactElement<INewTableRow> | React.ReactElement<INewTableRow>[];
  className?: string;
  keepRhythm?: boolean;
}

type TProps = INewTable & INewTableHeader;

export class NewTableRow extends React.Component<INewTableRow> {
  render(): React.ReactNode {
    const { children } = this.props;

    return (
      <tr className={styles.row}>
        {React.Children.map(children, child => {
          return (
            <th className={styles.cell} key={uniqueId("table-row")}>
              {child}
            </th>
          );
        })}
      </tr>
    );
  }
}

export const NewTable: React.SFC<TProps> = ({ titles, children, className, keepRhythm }) => {
  return (
    <Panel>
      <div className={cn(styles.tableWrapper, className, keepRhythm && "keep-rhythm")}>
        <table className={styles.table}>
          <thead className={styles.header}>
            <tr>
              {titles.map((title, index) => (
                <th className={styles.cell} key={index}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </Panel>
  );
};
