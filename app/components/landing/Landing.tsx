import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { appRoutes } from "../appRoutes";
import { Button } from "../shared/Buttons";
import { EtoOfferingCard, IProps } from "../shared/EtoOfferingCard";
import { EtoOfferingSoon } from "../shared/EtoOfferingSoon";
import { BulletPointWithDescription } from "./shared/BulletPointWithDescription";

import * as logoMobile from "../../assets/img/logo-square-white.svg";
import * as logo from "../../assets/img/logo_capitalized.svg";
import * as styles from "./Landing.module.scss";

const description =
  "Neufund is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech.";

const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.";

const sampleCard: IProps = {
  roundName: "seed round",
  tags: [
    {
      text: "fintech",
      layout: "ghost-bold",
      theme: "white",
    },
    {
      text: "germany",
      layout: "ghost-bold",
      theme: "white",
    },
  ],
  name: "Neufund",
  description,
  quote: {
    text: lorem,
    person: "John",
    position: "founder",
  },
  logo,
  to: "#0",
};

export const Landing: React.SFC = () => (
  <div className={styles.landingWrapper}>
    <section
      className={cn(
        styles.landing,
        (process.env.NF_EQUITY_TOKEN_OFFERINGS_VISIBLE === "0" || undefined) && "h-100",
      )}
    >
      <Container>
        <Row>
          <Col>
            <img
              className={cn(styles.image, "d-none", "d-lg-block")}
              src={logo}
              alt="Neufund logo"
            />
            <img
              className={cn(styles.image, styles.logoMobile, "d-lg-none")}
              src={logoMobile}
              alt="Neufund logo"
            />
          </Col>
        </Row>
        <Row>
          <Col className={styles.cta}>
            <FormattedMessage id="landing.welcome-box.cta" />
          </Col>
        </Row>
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
                <Button theme="t-white">
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
    {process.env.NF_EQUITY_TOKEN_OFFERINGS_VISIBLE === "1" && (
      <section className={styles.equityTokenOfferings}>
        <Container>
          <h2 className={styles.equityTokenHeader}>
            <FormattedMessage id="landing.equity-token-offering.header" />
          </h2>
          <Row>
            <Col xs={12} lg={6} className={styles.equityTokenCol}>
              <EtoOfferingCard {...sampleCard} />
            </Col>
            <Col xs={12} lg={6} className={styles.equityTokenCol}>
              <EtoOfferingCard {...sampleCard} />
            </Col>
            <Col xs={12} lg={6} className={styles.equityTokenCol}>
              <EtoOfferingCard {...sampleCard} />
            </Col>
            <Col xs={12} lg={6} className={styles.equityTokenCol}>
              <EtoOfferingSoon description="The most exciting company working with the creative community to create original content generation for the worlds leading brands. " />
            </Col>
          </Row>
        </Container>
      </section>
    )}
  </div>
);
