import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { Counter } from "./Counter";
import * as styles from "./Home.module.scss";

export const Home = () => (
  <Container>
    <Row>
      <Col>
        <h1 className={styles.header}>Hello world!</h1>
      </Col>
    </Row>
    <Counter />
  </Container>
);
