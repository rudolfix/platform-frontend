import { CommonHtmlProps } from "@neufund/design-system";
import * as cn from "classnames";
import * as React from "react";

import { TDataTestId } from "../../types";

import * as styles from "./LayoutWrapper.module.scss";

const LayoutWrapper: React.FunctionComponent<TDataTestId & CommonHtmlProps> = ({
  children,
  "data-test-id": dataTestId,
  className,
}) => (
  <div className={cn(styles.layout, className)} data-test-id={dataTestId}>
    {children}
  </div>
);

export { LayoutWrapper };
