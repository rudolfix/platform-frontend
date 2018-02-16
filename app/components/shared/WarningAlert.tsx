import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import * as warningSign from "../../assets/img/warning.svg";
import * as styles from "./WarningAlert.module.scss";

interface IWarningAlertProps {
  className?: string;
}

export const WarningAlert: React.SFC<IWarningAlertProps> = ({ children, className }) => (
  <Row className={cn("m-2 align-items-center", styles.warningAlert, className)} noGutters>
    <Col xs="auto">
      <img src={warningSign} className="mr-2" />
    </Col>
    <Col>{children}</Col>
  </Row>
);
