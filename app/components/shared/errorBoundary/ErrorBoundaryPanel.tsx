import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { PanelBase } from "../PanelBase";

import * as styles from "./ErrorBoundary.module.scss";

export const ErrorBoundaryPanel: React.SFC = () => (
  <PanelBase className={styles.panel}>
    <FormattedMessage id="error-boundary.widget-error-message" />
  </PanelBase>
);
