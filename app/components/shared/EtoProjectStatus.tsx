import * as React from "react";

import { FormattedMessage } from "react-intl-phraseapp";
import * as styles from "./EtoProjectStatus.module.scss";
import { ProjectStatus, TStatus } from './ProjectStatus';

interface IProps {
  status: TStatus;
}

export const EtoProjectState = (props: IProps) => (
  <div className={styles.statusOfEto}>
    <span className={styles.title}>
      <FormattedMessage id="shared-component.eto-overview.status-of-eto" />
    </span>
    <ProjectStatus status={props.status} />
  </div>
);
