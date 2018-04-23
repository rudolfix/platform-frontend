import { appRoutes } from "../AppRouter";

import * as cn from "classnames";
import { Col, Container, Row } from "reactstrap";

import * as React from "react";

import { CenteredListWithTitle } from "../shared/CenterdListWithTitle";
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
              <Row>
                <CenteredListWithTitle
                  title="Quick access to capital"
                  list={["One single pitch", "No roadshows", "Faster fundraising"]}
                />
                <CenteredListWithTitle
                  title="Reduced costs"
                  list={["Decreased amount of intermediaries", "Less paper work"]}
                />
                <CenteredListWithTitle
                  title="Instant capitalisation"
                  list={["Instant asset liquidation on secondary markets", "Asset flexibility"]}
                />
                <CenteredListWithTitle
                  title="Efficient investment"
                  list={["Symmetry of information", "Full alignment of investors and companies"]}
                />
              </Row>
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
                    title: "register",
                    description: `your company on the
                    Neufund platform`,
                  },
                  {
                    title: "specify",
                    description: `the terms of your offer
                    for investors`,
                  },
                  {
                    title: "raise",
                    description: `funds in ETH
                    and/or EUR`,
                  },
                  {
                    title: "close",
                    description: `the financing round`,
                  },
                  {
                    title: "govern",
                    description: `your organisation
                    after the ETO`,
                  },
                  {
                    title: `raise follow-on
                    rounds`,
                    description: `by issuing new
                    equity tokens`,
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
