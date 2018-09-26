import * as cn from "classnames";
import { kebabCase } from "lodash";
import * as React from "react";

import { ETOStateOnChain } from "../../modules/public-etos/types";

import * as styles from "./ProjectStatus.module.scss";

export interface IProps {
  status: number;
}

export const ProjectStatus: React.SFC<IProps> = ({ status }) => (
  <div className={cn(styles.projectStatus, kebabCase(ETOStateOnChain[status]))}>
    {ETOStateOnChain[status]}
  </div>
);
