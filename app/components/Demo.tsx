import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import * as styles from "./Demo.module.scss";

import {
  ButtonPrimary,
  ButtonPrimaryLink,
  ButtonSecondary,
  ButtonSecondaryLink,
} from "./shared/Buttons";
import { NavigationButton, NavigationLink } from "./shared/Navigation";

export const Demo: React.SFC = () => (
  <Container>
    <Row>
      <Col className={styles.demo}>
        <div>
          <ButtonPrimary>ButtonPrimary</ButtonPrimary>
          <ButtonPrimary disabled>ButtonPrimary disabled</ButtonPrimary>
          <ButtonPrimaryLink to="/">ButtonPrimaryLink</ButtonPrimaryLink>
          <hr />
          <ButtonSecondary>ButtonSecondary</ButtonSecondary>
          <ButtonSecondary disabled>ButtonSecondary disabled</ButtonSecondary>
          <ButtonSecondaryLink to="/">ButtonSecondary link</ButtonSecondaryLink>
          <hr />
          <a href="/">link</a>
          <hr />
          <NavigationButton forward text="NavigationButton" onClick={() => {}} />
          <NavigationButton disabled forward text="NavigationButton disabled" onClick={() => {}} />
          <NavigationLink forward to="/" text="NavigationLink" />
        </div>
      </Col>
    </Row>
  </Container>
);
