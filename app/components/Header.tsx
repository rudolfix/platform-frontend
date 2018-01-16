import * as React from "react";
import { Col, Container, Navbar, NavbarBrand, Row } from "reactstrap";

export const Header = () => (
  <Navbar color="primary" dark>
    <Container>
      <Row>
        <Col>
          <NavbarBrand href="/">Neufund Platform</NavbarBrand>
        </Col>
      </Row>
    </Container>
  </Navbar>
);
