import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import * as styles from "./SubHeader.module.scss";

interface ISubHeader {
  view: string;
}

export const SubHeader: React.SFC<ISubHeader & React.HTMLAttributes<HTMLDivElement>> = ({
  view,
  ...props
}) => (
  <Row {...props}>
    <Col>
      <span className={cn(styles.subHeader, "font-weight-bold pl-2")}>{view}</span>
    </Col>
  </Row>
);
