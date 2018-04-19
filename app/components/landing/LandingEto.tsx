import { appRoutes } from "../AppRouter";

import * as cn from "classnames";
import { Col, Container, Row } from "reactstrap";

import * as React from "react";

import { OffToOnCompany } from "./shared/OffToOnChainCompany";
import { RegisterCta } from "./shared/RegisterCta";

import * as styles from "./LandingEto.module.scss";

export const LandingEto: React.SFC = () => {
  return (
    <div className={styles.landingEto}>
      <RegisterCta
        text="Fundraise with equity token"
        ctaText="Regiseter an eto"
        ctaLink={appRoutes.registerEto}
      />
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
              <OffToOnCompany
                steps={[
                  {
                    htmlTitle: "register",
                    htmlDescription: "your company on the <br />Neufund platform",
                  },
                  {
                    htmlTitle: "specify",
                    htmlDescription: "the terms of your offer<br />for investors",
                  },
                  {
                    htmlTitle: "raise",
                    htmlDescription: "funds in ETH<br />and/or EUR",
                  },
                  {
                    htmlTitle: "close",
                    htmlDescription: "the financing round",
                  },
                  {
                    htmlTitle: "govern",
                    htmlDescription: "your organisation<br />after the ETO",
                  },
                  {
                    htmlTitle: "raise follow-on<br />rounds",
                    htmlDescription: "by issuing new<br />equity tokens",
                  },
                ]}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};
