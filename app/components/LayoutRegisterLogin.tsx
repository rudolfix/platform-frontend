import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import * as styles from "./LayoutRegisterLogin.module.scss";

export const LayoutRegisterLogin: React.SFC = ({ children }) => (
  <Container className={styles.layout}>
    <Row>
      <Col lg="12" xl={{ size: "10", offset: 1 }} className={styles.mainContainer}>
        {children}
      </Col>
    </Row>
  </Container>
);
