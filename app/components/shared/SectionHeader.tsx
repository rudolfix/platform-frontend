import * as cn from "classnames";
import * as React from "react";

import * as styles from "./SectionHeader.module.scss";

interface IProps {
  className?: string;
}

export const SectionHeader: React.SFC<IProps> = ({ children, className }) => (
  <h3 className={cn(styles.sectionHeader, className)}>{children}</h3>
);
