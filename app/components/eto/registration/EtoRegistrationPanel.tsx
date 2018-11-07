import * as React from "react";

import { Panel } from "../../shared/Panel";
import { EtoRegisterRouter } from "./Router";
import * as styles from './EtoRegistrationPanel.module.scss'

export const EtoRegistrationPanel: React.SFC = () => (
    <Panel className={styles.etoRegistrationPanel}>
      <EtoRegisterRouter />
    </Panel>
);
