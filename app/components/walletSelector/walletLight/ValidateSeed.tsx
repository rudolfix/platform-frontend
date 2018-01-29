import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import { walletLightRoutes } from "./walletLightRoutes";
//TODO: passphrase should be taken either as a prop or directly from store
const passphrase = "test dog cat hello star toad east car food jump picnic beast";

export const ValidateSeed: React.SFC<{}> = () => (
  <Row className="mt-5  mb-5 justify-content-sm-center">
    <Col sm="5">
      <Form className="align-self-end">
        <FormGroup>
          <Label>Email</Label>
          <fieldset disabled>
            <Input type="textarea" name="backup" id="passphrase" placeholder={passphrase} />
          </fieldset>
        </FormGroup>
        <Link className="btn btn-secondary" to={walletLightRoutes.create}>
          I saved it
        </Link>
      </Form>
    </Col>
  </Row>
);
