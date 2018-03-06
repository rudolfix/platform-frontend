import * as React from "react";
import { Col, Container, FormFeedback, FormGroup, Input, Row } from "reactstrap";

import * as styles from "./Demo.module.scss";

import {
  ButtonPrimary,
  ButtonPrimaryLink,
  ButtonSecondary,
  ButtonSecondaryLink,
} from "./shared/Buttons";
import { NavigationButton, NavigationLink } from "./shared/Navigation";
import { PanelDark } from "./shared/PanelDark";

export const Demo: React.SFC = () => (
  <Container className={styles.demo}>
    <Row>
      <Col>
        <ButtonPrimary>ButtonPrimary</ButtonPrimary>
        <ButtonPrimary disabled>ButtonPrimary disabled</ButtonPrimary>
        <ButtonPrimaryLink to="/">ButtonPrimaryLink</ButtonPrimaryLink>
      </Col>
    </Row>
    <hr className={styles.spacer} />
    <Row>
      <Col>
        <ButtonSecondary>ButtonSecondary</ButtonSecondary>
        <ButtonSecondary disabled>ButtonSecondary disabled</ButtonSecondary>
        <ButtonSecondaryLink to="/">ButtonSecondary link</ButtonSecondaryLink>
      </Col>
    </Row>
    <hr className={styles.spacer} />
    <Row>
      <Col>
        <a href="/">link</a>
      </Col>
    </Row>
    <hr className={styles.spacer} />
    <Row>
      <Col>
        <NavigationButton forward text="NavigationButton" onClick={() => {}} />
        <NavigationButton disabled forward text="NavigationButton disabled" onClick={() => {}} />
        <NavigationLink forward to="/" text="NavigationLink" />
      </Col>
    </Row>
    <hr className={styles.spacer} />
    <Row>
      <Col>
        <FormGroup>
          <Input placeholder={"This form is always invalid"} valid={false} />
          <FormFeedback>invalid</FormFeedback>
        </FormGroup>
      </Col>
    </Row>
    <hr className={styles.spacer} />
    <Row>
      <Col>
        <PanelDark
          headerText="header text"
          rightComponent={
            <span style={{ height: "60px", backgroundColor: "red" }}>right component</span>
          }
        >
          <p>So this is our dark panel. It can contain React.Nodes as children and two props:</p>
          <dl>
            <dt>headerText: string</dt>
            <dd>Title of panel it will be rendered in span element</dd>
            <dt>rightComponent: ReactNode</dt>
            <dd>Component that will be put in header on right side.</dd>
          </dl>
        </PanelDark>
      </Col>
    </Row>
  </Container>
);
