import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";

import * as styles from "./Content.module.scss";

export const LandingContent: React.FunctionComponent<CommonHtmlProps> = ({
  children,
  className,
}) => (
  <div className={cn(styles.landingContent, className)}>
    <React.Suspense fallback={<LoadingIndicator />}>{children}</React.Suspense>
  </div>
);

export const Content: React.FunctionComponent<CommonHtmlProps> = ({ children, className }) => (
  <div className={cn(styles.content, className)}>
    <React.Suspense fallback={<LoadingIndicator />}>{children}</React.Suspense>
  </div>
);

export const ContentRegisterLogin: React.FunctionComponent = ({ children }) => (
  <div className={styles.content}>
    <div data-test-id="register-layout" className={styles.registerLoginContainer}>
      <React.Suspense fallback={<LoadingIndicator />}>{children}</React.Suspense>
    </div>
  </div>
);
