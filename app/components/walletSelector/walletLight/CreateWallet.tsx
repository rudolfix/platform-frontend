import * as React from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { compose } from "redux";
import { tryConnectingWithLightWallet } from "../../../modules/wallet-selector/light-wizard/actions";
import { appConnect } from "../../../store";

export const CreateWalletComponent: React.SFC<any> = props => {
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
          <Button className="btn btn-secondary" onClick={props.create}>
            Create Account
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export const CreateWallet = compose<React.SFC>(
  appConnect<any, any>({
    dispatchToProps: dispatch => ({
      create: () => dispatch(tryConnectingWithLightWallet("test", "password")),
    }),
  }),
)(CreateWalletComponent);
