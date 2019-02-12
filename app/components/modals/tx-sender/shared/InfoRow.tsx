import * as React from "react";
import { ListGroupItem } from "reactstrap";

import { TDataTestId } from "../../../../types";

import * as styles from "./InfoRow.module.scss";

interface IInfoRowProps {
  caption: React.ReactNode;
  value: string | React.ReactNode;
}

export const InfoRow: React.FunctionComponent<IInfoRowProps & TDataTestId> = ({
  caption,
  value,
  "data-test-id": dataTestId,
}) => (
  <ListGroupItem className={styles.infoRow}>
    <div className={styles.infoCell}>{caption}</div>
    <div className={styles.infoCell} data-test-id={dataTestId}>
      {value}
    </div>
  </ListGroupItem>
);
