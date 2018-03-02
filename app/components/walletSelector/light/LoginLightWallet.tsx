import * as React from "react";
import { Col, Row } from "reactstrap";
import { LoginWithEmailLightWallet } from './LoginWithEmailLightWallet';

export const LoginLightWallet = () => (
  <Row className="justify-content-sm-center mb-5">
    <Col xs="12" md="5" className="align-self-end">
      <h1 className="text-center mb-4">Welcome Back!</h1>
      <LoginWithEmailLightWallet />
    </Col>
  </Row>
);
