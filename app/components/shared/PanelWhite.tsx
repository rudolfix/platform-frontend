import * as cn from "classnames";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import * as styles from "./PanelWhite.module.scss";

export const PanelWhite: React.SFC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <Container {...props} className={cn(styles.panel, className)}>
    <Row>
      <Col>{children}</Col>
    </Row>
  </Container>
);
