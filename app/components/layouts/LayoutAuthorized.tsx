import * as React from "react";
import { Col, Row } from "reactstrap";

import * as styles from "./LayoutAuthorized.module.scss";

interface ILayoutAuthorizedProps {
  menu: React.ReactNode;
}

export const LayoutAuthorized: React.SFC<ILayoutAuthorizedProps> = ({ menu, children }) => (
  <Row className="h-100">
    <Col xs={12} sm="auto">
      <div className={styles.menu}>{menu}</div>
    </Col>
    <Col className={styles.content}>{children}</Col>
  </Row>
);
