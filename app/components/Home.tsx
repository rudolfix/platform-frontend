import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { appRoutes } from "./AppRouter";
import { Button } from "./shared/Buttons";

export const Home: React.SFC = () => (
  <Container>
    <Row className="mt-3">
      <Col>
        <h2 data-test-id="homepage-title">Home</h2>
        <p>Not logged in</p>
        <Link to={appRoutes.login}>
          <Button>Login</Button>
        </Link>
        <Link to={appRoutes.register}>
          <Button>Register</Button>
        </Link>
      </Col>
    </Row>
  </Container>
);
