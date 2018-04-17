import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { appRoutes } from "./AppRouter";
import { Button } from "./shared/Buttons";
import { SectionHeader } from "./shared/SectionHeader";
import { loginWalletRoutes } from "./walletSelector/walletRoutes";

export const Home: React.SFC = () => (
  <Container>
    <Row className="mt-3">
      <Col>
        <h2 data-test-id="homepage-title">Home</h2>
        <p>Not logged in</p>
      </Col>
    </Row>
    <Row className="mb-5">
      <Col>
        <SectionHeader>Investors:</SectionHeader>
        <Link to={loginWalletRoutes.light}>
          <Button>Login</Button>
        </Link>
        <br />
        <br />
        <Link to={appRoutes.register}>
          <Button>Register</Button>
        </Link>
      </Col>
    </Row>

    <Row>
      <Col>
        <SectionHeader>Issuers:</SectionHeader>
        <Link to={appRoutes.loginEto}>
          <Button>Login</Button>
        </Link>
        <br />
        <br />
        <Link to={appRoutes.registerEto}>
          <Button>Register</Button>
        </Link>
      </Col>
    </Row>
  </Container>
);
