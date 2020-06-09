import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TDataTestId } from "../../types";
import { CopyToClipboardButton } from "./CopyToClipboardButton";

import * as styles from "./DataRow.module.scss";

enum EDataRowSize {
  SMALL = styles.smallSize,
  NORMAL = styles.normalSize,
}

interface IDataRowProps {
  value: React.ReactNode;
  caption?: React.ReactNode;
  size?: EDataRowSize;
  clipboardCopyValue?: string;
  noOverflow?: boolean;
}

const DataRowSeparator: React.FunctionComponent = () => <hr className={styles.separator} />;

/* This is similar component to InfoRow, but it's not utilize Lists */
const DataRow: React.FunctionComponent<IDataRowProps & CommonHtmlProps & TDataTestId> = ({
  caption,
  value,
  clipboardCopyValue,
  "data-test-id": dataTestId,
  className,
  noOverflow,
  size = EDataRowSize.NORMAL,
}) => (
  <section className={cn(styles.section, size, className)}>
    <span className={styles.caption}>{caption}</span>
    <span className={cn(styles.value, { [styles.noOverflow]: !noOverflow })}>
      <span data-test-id={dataTestId}>{value}</span>
      {clipboardCopyValue && <CopyToClipboardButton className="ml-2" value={clipboardCopyValue} />}
    </span>
  </section>
);

const DataRowSeparated: React.FunctionComponent<IDataRowProps & CommonHtmlProps & TDataTestId> = ({
  className,
  ...props
}) => <DataRow className={cn(styles.separated, className)} {...props} />;

export { DataRow, DataRowSeparated, DataRowSeparator, EDataRowSize };
