import * as cn from "classnames";
import * as React from "react";

import { FormattedMessage } from "react-intl-phraseapp";
import { EtoState } from "../../lib/api/eto/EtoApi.interfaces";

import * as styles from "./EtoProjectState.module.scss";

interface IProps {
  status: EtoState;
}

export const messages = {
  preview: <FormattedMessage id="shared-component.eto-overview.status-in-preview" />,
  pending: <FormattedMessage id="shared-component.eto-overview.status-in-review" />,
  listed: <FormattedMessage id="shared-component.eto-overview.status-listed" />,
  prospectus_approved: <FormattedMessage id="shared-component.eto-status.prospectus-approved" />,
  on_chain: <FormattedMessage id="shared-component.eto-overview.status-on-chain" />,
};

export const EtoProjectState: React.SFC<IProps> = ({ status }) => (
  <div className={styles.statusOfEto}>
    <div className={cn(styles.projectStatus, status)} />
    <span className={styles.title}>{messages[status]}</span>
  </div>
);
