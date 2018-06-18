import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { CommonHtmlProps } from "../../../types";
import { appRoutes } from "../../appRoutes";
import { Button } from "../../shared/Buttons";
import { HiResImage } from "../../shared/HiResImage";
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
              smart contracts - Equity Token Offerings.
            </p>
            <p className={styles.heroDescription}>The future of fundraising is launching soon.</p>

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

export const JoinCta: React.SFC<CommonHtmlProps> = htmlProps => (
  <div className={cn("d-flex", htmlProps.className)} style={htmlProps.style}>
    <Link to={appRoutes.register}>
      <Button theme="brand">Register NOW</Button>
    </Link>

    <span className="m-2">or</span>

    <form className={cn("form-inline", styles.email)}>
      <input type="text" className={styles.emailInput} placeholder="Email me updates" />
      <button type="submit" className={styles.emailBtn}>
        Subscribe
      </button>
    </form>
  </div>
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
      <HiResImage partialPath="landing/brille" />
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
