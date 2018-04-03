import * as cn from "classnames";
import * as React from "react";

import { Container } from "reactstrap";
import * as styles from "./PanelWhite.module.scss";

export const PanelWhite: React.SFC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
    <div {...props} className={cn(styles.panel, className)}>
      {children}
    </div>
  );
