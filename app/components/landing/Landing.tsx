import * as cn from "classnames";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { etoCompaniesCards } from "../../data/etoCompanies";
import { EtoCard } from "../shared/EtoCard";
import { Features } from "./parts/Features";
import { LandingHeader } from "./parts/LandingHeader";
import { Testimonials } from "./parts/Testimonials";

import * as styles from "./Landing.module.scss";

export const Landing: React.SFC = () => (
  <div className={cn(styles.landingWrapper, "pure")}>
    <LandingHeader />
    <Features />

    <section className={styles.equityTokenOfferings}>
      <Container>
        <Row>
          <Col>
            <h2 className={styles.etoCardsHeader}>
              Meet the first off-chain companies tokenizing their shares under German jurisdiction
            </h2>
          </Col>
        </Row>

        <Row>
          {etoCompaniesCards.map((e, index) => (
            <Col
              xs={12}
              lg={6}
              className={styles.equityTokenCol}
              id={`eto-card-${index}`}
              key={index}
            >
              <EtoCard {...e} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>

    <Testimonials />
  </div>
);
