import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { HiResImage } from "../../shared/HiResImage";
import { JoinCta } from "./JoinCta";

import * as styles from "./LandingHeader.module.scss";

export const LandingHeader: React.SFC = () => (
  <section className={styles.hero}>
    <Container>
      <Row>
        <Col lg={6}>
          <div className={styles.heroCta}>
            <h1 className={styles.heroHeader}>
              <FormattedMessage id="landing.hero.header" />
            </h1>
            <p className={styles.heroDescription}>
              Neufund makes it possible to invest in real world equity on the Ethereum Blockchain.
              Our platform enables primary offerings of investment assets through legally binding
              smart contracts -{" "}
              <a href="https://neufund.org/fundraise-with-equity-token" target="_blank">
                Equity Token Offerings
              </a>.
            </p>
            <p className={styles.heroDescription}>The future of fundraising is launching now.</p>

            <JoinCta />
          </div>
        </Col>
        <Col lg={6} className="d-none d-lg-block">
          <CompanyImages />
        </Col>
      </Row>
    </Container>
  </section>
);

const CompanyImages: React.SFC = () => (
  <div className={styles.images}>
    <a href="#eto-card-2" className={styles.companyImage}>
      <HiResImage partialPath="landing/myswooop" />
    </a>
    <a href="#eto-card-1" className={styles.companyImage}>
      <HiResImage partialPath="landing/uniti" />
    </a>
    <a href="#eto-card-0" className={styles.companyImage}>
      <HiResImage partialPath="landing/brille" max2x />
    </a>
    <a href="#eto-card-5" className={styles.companyImage}>
      <HiResImage partialPath="landing/blockstate" />
    </a>
    <a href="#eto-card-4" className={styles.companyImage}>
      <HiResImage partialPath="landing/emflux" />
    </a>
    <a href="#eto-card-3" className={styles.companyImage}>
      <HiResImage partialPath="landing/BT" />
    </a>
  </div>
);
