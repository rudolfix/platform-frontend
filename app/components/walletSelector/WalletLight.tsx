import * as React from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

const passphrase = "test dog cat hello star toad east car food jump picnic beast";
export const WalletLight = () => (
  <div>
    <Row className="justify-content-md-center">
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
          <Button>Create Account</Button>
        </Form>
      </Col>
    </Row>

    <Row className="mt-5 justify-content-md-center">
      <Col sm="5">
        <Form className="align-self-end">
          <FormGroup>
            <Label for="exampleEmail">Email</Label>
            <fieldset disabled>
              <Input type="textarea" name="backup" id="passphrase" placeholder={passphrase} />
            </fieldset>
          </FormGroup>
          <Button>I saved it</Button>
        </Form>
      </Col>
    </Row>

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
          <Button>I saved it</Button>
        </Form>
      </Col>
    </Row>
  </div>
);
