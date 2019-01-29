import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";

import * as styles from "./Panel.module.scss";

export interface IPanelBaseProps extends CommonHtmlProps {
  narrow?: boolean;
}

const PanelBase: React.FunctionComponent<IPanelBaseProps> = ({
  className,
  children,
  narrow,
  ...props
}) => {
  return (
    <div {...props} className={cn(styles.panel, className, { [styles.narrow]: narrow })}>
      {children}
    </div>
  );
};

export { PanelBase };
