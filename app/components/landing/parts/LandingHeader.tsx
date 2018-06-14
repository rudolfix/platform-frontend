import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container, Row, Col } from "reactstrap";

import * as styles from "./LandingHeader.module.scss";
import { HiResImage } from "../../shared/HiResImage";

export const LandingHeader: React.SFC = () => (
  <section className={styles.hero}>
    <Container>
      <Row>
        <Col lg={6}>
          <div className={styles.heroCta}>
            <h2 className={styles.heroHeader}>
              <FormattedMessage id="landing.hero.header" />
            </h2>
            <p className={styles.heroDescription}>
              <FormattedMessage id="landing.hero.description" />
            </p>
            <NewsletterCta />
          </div>
        </Col>
        <Col lg={6}>
          <CompanyImages />
        </Col>
      </Row>
    </Container>
  </section>
);

const NewsletterCta: React.SFC = () => (
  <form className={cn("form-inline", styles.email)}>
    <input type="text" className={styles.emailInput} placeholder="Email me updates" />
    <button type="submit" className={styles.emailBtn}>
      Subscribe
    </button>
  </form>
);


const CompanyImages: React.SFC = () => (
  <div className={styles.images}>
    <HiResImage partialPath="landing/myswooop" className={cn(styles.companyImage)} />
    <HiResImage partialPath="landing/uniti" className={styles.companyImage} />
    <HiResImage partialPath="landing/brille" className={styles.companyImage} />
    <HiResImage partialPath="landing/blockstate" className={styles.companyImage} />
    <HiResImage partialPath="landing/emflux" className={styles.companyImage} />
    <HiResImage partialPath="landing/BT" className={styles.companyImage} />
  </div>
)
