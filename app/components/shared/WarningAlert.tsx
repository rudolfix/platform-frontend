import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import * as styles from "./WarningAlert.module.scss";

interface IWarningAlertProps {
  className?: string;
}

export const WarningAlert: React.SFC<IWarningAlertProps> = ({ children, className }) => (
  <Row
    className={cn("m-2 align-items-center justify-content-center", styles.warningAlert, className)}
    noGutters
  >
    <Col xs={10}>
      <i className={cn("fa fa-exclamation-circle mr-2", styles.icon)} aria-hidden="true" />
      {children}
    </Col>
  </Row>
);
