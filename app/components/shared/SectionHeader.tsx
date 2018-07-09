import * as cn from "classnames";
import * as React from "react";

import * as styles from "./SectionHeader.module.scss";

interface IProps {
  className?: string;
  hasDecorator?: boolean;
}

export const SectionHeader: React.SFC<IProps> = ({ children, className, hasDecorator }) => (
  <h3 className={cn(styles.sectionHeader, className, hasDecorator && "has-decorator")}>
    {children}
  </h3>
);

SectionHeader.defaultProps = {
  hasDecorator: true,
};
