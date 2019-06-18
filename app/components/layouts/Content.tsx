import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";

import * as styles from "./Content.module.scss";

export const Content: React.FunctionComponent<CommonHtmlProps> = ({ children, className }) => (
  <div className={cn(styles.content, className)}>
    <React.Suspense fallback={<LoadingIndicator />}>{children}</React.Suspense>
  </div>
);
