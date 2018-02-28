import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import * as styles from "./Demo.module.scss";

import { ButtonPrimary, ButtonSecondary } from "./shared/Buttons";
import { NavigationButton, NavigationLink } from "./shared/Navigation";

export const Demo: React.SFC = () => (
  <Container>
    <Row>
      <Col className={styles.demo}>
        <div>
          <ButtonPrimary>
            Button primary
          </ButtonPrimary>

          <ButtonPrimary disabled>
            Button primary disabled
          </ButtonPrimary>

          <hr />

          <ButtonSecondary>
            Button secondary
          </ButtonSecondary>

          <ButtonSecondary disabled>
            Button secondary disabled
          </ButtonSecondary>

          <hr />

          <a href="/">link</a>

          <hr />

          <NavigationButton forward text="NavigationButton" onClick={() => {}}/>
          {" "}
          <NavigationLink forward to="/" text="NavigationLink" />

        </div>
      </Col>
    </Row>
  </Container>
);
