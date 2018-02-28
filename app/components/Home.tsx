import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { appRoutes } from "./AppRouter";

export const Home: React.SFC = () => (
  <Container>
    <Row className="mt-3">
      <Col>
        <h2 data-test-id="homepage-title">Home</h2>
        <p>Not logged in</p>
        <Link to={appRoutes.register}>Register</Link>
      </Col>
    </Row>
  </Container>
);
