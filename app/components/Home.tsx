import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import * as styles from "./Home.module.scss";

export const Home = () => (
  <Container>
    <Row>
      <Col>
        <h1 className={styles.header}>Neufund Platform!</h1>
      </Col>
    </Row>
  </Container>
);
