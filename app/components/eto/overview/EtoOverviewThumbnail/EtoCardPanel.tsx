import * as React from "react";

import { TDataTestId } from "../../../../types";
import { Panel } from "../../../shared/Panel";

import * as styles from "./EtoCardPanel.module.scss";

interface IBaseProps {
  onClick: () => void;
}

export const EtoCardPanel: React.FunctionComponent<IBaseProps & TDataTestId> = ({
  children,
  onClick,
  "data-test-id": dataTestId,
}) => (
  <button className={styles.button} onClick={onClick}>
    <Panel data-test-id={dataTestId}>{children}</Panel>
  </button>
);
