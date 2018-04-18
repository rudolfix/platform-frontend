import * as cn from "classnames";
import { Col, Container, Row } from 'reactstrap';

import * as React from 'react';

import { RegisterCta } from './shared/RegisterCta';

import * as styles from "./LandingEto.module.scss";

export const LandingEto: React.SFC = () => {
  return (
    <div className={styles.landingEto}>
      <RegisterCta
        onRegister={() => { }}
        text="Fundraise with equity token"
        ctaText="Regiseter an eto" />
      <section className={cn(styles.landingContainer, "t-white")}>
        <Container>
          <Row>
            <Col>
              <h2>Why fundraise with equity token?</h2>
            </Col>
          </Row>
        </Container>
      </section>
      <section className={styles.landingContainer}>
        <Container>
          <Row>
            <Col>
              <h2>6 steps to ETO your company</h2>
              <div className={styles.stepsToEto}>

              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}
