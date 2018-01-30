import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import { walletLightRoutes } from "./walletLightRoutes";

export const CreateWallet: React.SFC<{}> = () => {
  return (
    <Row className="justify-content-sm-center mt-3">
      <Col sm="5">
        <Form className="align-self-end">
          <FormGroup>
            <Label>Email</Label>
            <Input type="email" name="email" id="email" />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input type="password" name="password" id="password" />
          </FormGroup>
          <FormGroup>
            <Label>Repeat password</Label>
            <Input type="password" name="repeated" id="repeated-pass" />
          </FormGroup>
          <Link className="btn btn-secondary" to={walletLightRoutes.validate}>
            Create Account
          </Link>
        </Form>
      </Col>
    </Row>
  );
};
