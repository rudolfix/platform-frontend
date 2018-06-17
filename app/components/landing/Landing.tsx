import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { etoCompaniesCards } from "../../data/etoCompanies";
import { EtoCard } from "../shared/EtoCard";
import { Features } from "./parts/Features";
import { LandingHeader } from "./parts/LandingHeader";
import { Testimonials } from "./parts/Testimonials";

import * as styles from "./Landing.module.scss";

export const Landing: React.SFC = () => (
  <div className={styles.landingWrapper}>
    <LandingHeader />
    <Features />

    <section className={styles.equityTokenOfferings}>
      <Container>
        <Row>
          <Col>
            <h2 className="text-center">
              Meet the first off-chain companies tokenizing their shares under German jurisdiction
            </h2>
          </Col>
        </Row>

        <Row>
          {etoCompaniesCards.map((e, k) => (
            <Col xs={12} lg={6} className={styles.equityTokenCol} key={k}>
              <EtoCard {...e} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>

    <Testimonials />
  </div>
);
