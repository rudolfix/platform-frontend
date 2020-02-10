import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TDataTestId, TTranslatedString } from "../../types";
import { Container, EColumnSpan } from "../layouts/Container";
import { EHeadingSize, Heading } from "./Heading";

import * as styles from "./Panel.module.scss";

export interface IPanelProps {
  headerText?: TTranslatedString;
  rightComponent?: React.ReactNode;
  icon?: string;
  narrow?: boolean;
  columnSpan?: EColumnSpan;
}

const PanelBase: React.FunctionComponent<IPanelProps & CommonHtmlProps & TDataTestId> = ({
  headerText,
  rightComponent,
  className,
  children,
  narrow,
  columnSpan,
  "data-test-id": dataTestId,
}) => (
  <Container
    columnSpan={columnSpan}
    className={cn(styles.panel, className, {
      [styles.narrow]: narrow,
    })}
    data-test-id={dataTestId}
  >
    {(headerText || rightComponent) && (
      <div className={cn(styles.header)}>
        {headerText}
        {rightComponent}
      </div>
    )}
    {children}
  </Container>
);

const Panel: React.FunctionComponent<IPanelProps & CommonHtmlProps & TDataTestId> = ({
  children,
  className,
  headerText,
  icon,
  ...props
}) => (
  <PanelBase
    headerText={
      headerText ? (
        <Heading level={3} size={EHeadingSize.SMALL} decorator={icon}>
          {headerText}
        </Heading>
      ) : (
        undefined
      )
    }
    className={cn(styles.defaultPanel, className)}
    {...props}
  >
    {children}
  </PanelBase>
);

const PanelRounded: React.FunctionComponent<IPanelProps & CommonHtmlProps & TDataTestId> = ({
  children,
  className,
  ...props
}) => (
  <PanelBase className={cn(styles.rounded, className)} {...props}>
    {children}
  </PanelBase>
);

export { Panel, PanelRounded };
