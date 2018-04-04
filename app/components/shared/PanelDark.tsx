import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import * as styles from "./PanelDark.module.scss";

export interface IPanelDarkProps {
  headerText: string;
  rightComponent?: React.ReactNode;
  icon?: string;
}

export const PanelDark: React.SFC<IPanelDarkProps & React.HTMLAttributes<HTMLDivElement>> = ({
  headerText,
  rightComponent,
  className,
  children,
  icon,
  ...props
}) => (
  <Col {...props} className={cn(styles.panel, className)}>
    <Row className={styles.headerRow}>
      <Col
        className={cn(styles.header, "d-flex flex-wrap justify-content-between align-items-center")}
      >
        <span className={styles.headerText} data-test-id="panelDark-header-text">
          {icon && <img src={icon} className={styles.icon} />}
          {headerText}
        </span>
        {rightComponent}
      </Col>
    </Row>
    <Row>
      <Col>{children}</Col>
    </Row>
  </Col>
);
