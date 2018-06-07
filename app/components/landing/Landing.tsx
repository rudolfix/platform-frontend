import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { etoCompaniesCards } from "../../data/etoCompanies";
import { appRoutes } from "../appRoutes";
import { Button } from "../shared/Buttons";
import { EtoCard } from "../shared/EtoCard";
import { BulletPointWithDescription } from "./shared/BulletPointWithDescription";

import * as styles from "./Landing.module.scss";

export const Landing: React.SFC = () => (
  <div className={styles.landingWrapper}>
    <section className={styles.hero}>
    <Container>
        <Row>
          <Col xs={12} md={6}></Col>
          <Col xs={12} md={6}></Col>
        </Row>
      </Container>
    </section>
    {process.env.NF_EQUITY_TOKEN_OFFERINGS_VISIBLE === "1" && (
      <section className={styles.equityTokenOfferings}>
        <Container>
          <Row>
            {etoCompaniesCards.map(e => (
              <Col xs={12} lg={6} className={styles.equityTokenCol}>
                <EtoCard {...e} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    )}
    <section
      className={cn(
        styles.landing,
        process.env.NF_EQUITY_TOKEN_OFFERINGS_VISIBLE !== "1" && "h-100",
      )}
    >
      <Container>
        <Row>
          <div className={styles.welcomeBox}>
            <h2 className={styles.welcomeHeader}>
              <FormattedMessage id="landing.welcome-box.header" />
            </h2>
            <Row className={styles.bullets}>
              <Col xs={12} lg={6}>
                <BulletPointWithDescription
                  header={<FormattedMessage id="landing.welcome-box.bullet.one.header" />}
                  description={<FormattedMessage id="landing.welcome-box.bullet.one.description" />}
                  index={1}
                />
              </Col>
              <Col xs={12} lg={6} className="mt-4 mt-lg-0">
                <BulletPointWithDescription
                  header={<FormattedMessage id="landing.welcome-box.bullet.two.header" />}
                  description={<FormattedMessage id="landing.welcome-box.bullet.two.description" />}
                  index={2}
                />
              </Col>
            </Row>
            <div className={styles.buttonWrapper}>
              <Link to={appRoutes.register}>
                <Button theme="brand">
                  <FormattedMessage id="landing.welcome-box.register-now" />
                </Button>
              </Link>
            </div>
          </div>
        </Row>
        <Row className="d-flex">
          <a className={styles.learnMore} href="https://neufund.org/investing" target="_blank">
            <FormattedMessage id="landing.learn-more" />
          </a>
        </Row>
      </Container>
    </section>
  </div>
);
