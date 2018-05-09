import * as cn from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import * as styles from "./ProjectStatus.module.scss";

export type TStatus = "book-building" | "whitelisted" | "public" | "in-signing" | "pay-off";

export interface IProps {
  status: TStatus;
}

export const messages = {
  "book-building": <FormattedMessage id="project-status.book-building" />,
  "whitelisted": <FormattedMessage id="project-status.whitelisted" />,
  "public": <FormattedMessage id="project-status.public" />,
  "in-signing": <FormattedMessage id="project-status.in-signing" />,
  "pay-off": <FormattedMessage id="project-status.pay-off" />
};

export const ProjectStatus: React.SFC<IProps> = ({ status }) => (
  <div className={cn(styles.projectStatus, status)}>
    {messages[status]}
  </div>
)
