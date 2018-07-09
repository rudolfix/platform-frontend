import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import * as styles from "./ProjectStatus.module.scss";

export type TStatus = "campaigning" | "pre-eto" | "public-eto" | "in-signing" | "claim" | "refund";

export interface IProps {
  status: TStatus;
}

export const messages = {
  campaigning: <FormattedMessage id="project-status.campaigning" />,
  "pre-eto": <FormattedMessage id="project-status.pre-eto" />,
  "public-eto": <FormattedMessage id="project-status.public-eto" />,
  "in-signing": <FormattedMessage id="project-status.in-signing" />,
  claim: <FormattedMessage id="project-status.claim" />,
  refund: <FormattedMessage id="project-status.refund" />,
};

export const ProjectStatus: React.SFC<IProps> = ({ status }) => (
  <div className={cn(styles.projectStatus, status)}>{messages[status]}</div>
);
