import * as React from "react";
import { Col, Container, Row } from "reactstrap";
import { appRoutes } from "./AppRouter";
import { ButtonSecondaryLink } from "./shared/Buttons";

export const Home: React.SFC = () => (
  <Container>
    <Row className="mt-3">
      <Col>
        <h2 data-test-id="homepage-title">Home</h2>
        <p>Not logged in</p>
        <ButtonSecondaryLink to={appRoutes.login}>Login</ButtonSecondaryLink>
        <ButtonSecondaryLink to={appRoutes.register}>Register</ButtonSecondaryLink>
      </Col>
    </Row>
  </Container>
);
