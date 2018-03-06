import * as React from "react";
import { Col, Row } from "reactstrap";

import * as styles from "./LayoutAuthorized.module.scss";

export const LayoutAuthorized: React.SFC = ({ children }) => (
  <Row className="h-100">
    <Col xs={12} sm="auto">
      <div className={styles.menu}>MENU</div>
    </Col>
    <Col className={styles.content}>{children}</Col>
  </Row>
);
