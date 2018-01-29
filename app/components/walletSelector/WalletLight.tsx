import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";

import { WalletLightRouter } from "./WalletLightRouter";
import { walletLightRoutes } from "./walletLightRoutes";
const passphrase = "test dog cat hello star toad east car food jump picnic beast";

interface ISavePassPhraseLight {
  seed: string;
}

export const SavePassPhrase: React.SFC<ISavePassPhraseLight> = () => (
  <Row className="mt-5  mb-5 justify-content-md-center">
    <Col sm="5">
      <Form className="align-self-end">
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
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
export const RecoverWalletLight: React.SFC<{}> = () => {
  return (
    <Row className="mt-5 justify-content-md-center">
      <Col sm="5">
        <Form className="align-self-end">
          <FormGroup>
            <Label for="copy-backup">Backup phrases</Label>
            <Input
              type="textarea"
              name="backup"
              id="backup-phrase"
              placeholder="Enter your backup phrases here"
            />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">Email</Label>
            <Input type="email" name="email" id="email-recover" />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">Password</Label>
            <Input type="password" name="password" id="recover-password" />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">Repeat password</Label>
            <Input type="password" name="repeated" id="recov-repeated-pass" />
          </FormGroup>
          {/*TODO*/}
          <Link className="btn btn-secondary" to={walletLightRoutes.create}>
            I saved it
          </Link>
        </Form>
      </Col>
    </Row>
  );
};
export const CreateWallet: React.SFC<{}> = () => {
  return (
    <Row className="justify-content-md-center mt-3">
      <Col sm="5">
        <Form className="align-self-end">
          <FormGroup>
            <Label for="exampleEmail">Email</Label>
            <Input type="email" name="email" id="email" />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">Password</Label>
            <Input type="password" name="password" id="password" />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">Repeat password</Label>
            <Input type="password" name="repeated" id="repeated-pass" />
          </FormGroup>
          <Link className="btn btn-secondary" to={walletLightRoutes.save}>
            Create Account
          </Link>
        </Form>
      </Col>
    </Row>
  );
};
export const WalletLight: React.SFC<{}> = () => (
  <Container>
    <WalletLightRouter />
  </Container>
);
