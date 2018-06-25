import * as cn from "classnames";
import * as React from "react";

import * as styles from "./LoadingIndicator.module.scss";

interface ILoadingIndicatorProps {
  className?: string;
  light?: boolean;
}

export const LoadingIndicator: React.SFC<ILoadingIndicatorProps> = ({ className, light }) => (
  <div className={cn(className, styles.spinner, { [styles.light]: light })} />
);

LoadingIndicator.displayName = "LoadingIndicator";
