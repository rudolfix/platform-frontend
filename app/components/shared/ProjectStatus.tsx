import * as cn from "classnames";
import * as React from "react";

import * as styles from "./ProjectStatus.module.scss";

export interface IProps {
  status: string;
}

export const ProjectStatus: React.SFC<IProps> = ({ status }) => (
  <div className={cn(styles.projectStatus)}>{status.replace("_", " ")}</div>
);
