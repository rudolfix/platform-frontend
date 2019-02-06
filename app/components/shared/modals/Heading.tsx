import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";

import * as styles from "./Modals.module.scss";

export const Heading: React.FunctionComponent<CommonHtmlProps> = ({
  children,
  className,
  ...props
}) => (
  <h4 {...props} className={cn(styles.heading, className)}>
    {children}
  </h4>
);
