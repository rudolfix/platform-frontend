import * as React from "react";
import { NavbarBrand, Navbar, Col, Row, Container } from "reactstrap";

import * as styles from "./App.module.scss";

export const App = () => (
  <div>
    <Navbar color="primary" dark>
      <NavbarBrand href="/">Neufund Platform</NavbarBrand>
    </Navbar>

    <Container>
      <Row>
        <Col>
          <h1 className={styles.header}>Hello world!</h1>
        </Col>
      </Row>
    </Container>
  </div>
);
