import * as cn from "classnames";
import * as React from "react";

import * as styles from "./SectionHeader.module.scss";

interface IProps {
  className?: string;
  layoutHasDecorator?: boolean;
}

export const SectionHeader: React.SFC<IProps> = ({ children, className, layoutHasDecorator }) => (
  <h3 className={cn(styles.sectionHeader, className, layoutHasDecorator && "has-decorator")}>
    {children}
  </h3>
);

SectionHeader.defaultProps = {
  layoutHasDecorator: true,
};
