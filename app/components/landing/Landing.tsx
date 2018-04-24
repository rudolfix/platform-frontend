import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Container, Row } from "reactstrap";

import { appRoutes } from "../AppRouter";
import { InvestmentPreview } from "../shared/InvestmentPreview";
import { SectionHeader } from "../shared/SectionHeader";
import { RegisterCta } from "./shared/RegisterCta";

import { injectIntlHelpers } from "../../utils/injectIntlHelpers";
import * as styles from "./Landing.module.scss";

export const Landing = injectIntlHelpers(({ intl: { formatIntlMessage } }) => {
  return (
    <div className={styles.landing}>
      <RegisterCta
        text={formatIntlMessage("investors-landing.cta")}
        ctaText={formatIntlMessage("investors-landing.cta-register")}
        ctaLink={appRoutes.register}
      />
      <div className={styles.landingContainer}>
        <Container>
          <SectionHeader className="my-4">
            <FormattedMessage id="investors-landing.header" />
          </SectionHeader>
          <Row>
            <Col>
              <InvestmentPreview
                className="mb-3"
                linkToDetails="#0"
                moneyGoal={"400€"}
                currentValuation={"4000€"}
                tokenPrice={"2€"}
                neuInvestorsNum={500}
                startingOn="22.12.2019"
                handleEmailSend={() => {}}
                endInDays={25}
                company={"Superawesome startup 2"}
                hasStarted={true}
                detailsLink="#0"
                preFoundingStatus={{
                  money: "€ 50M",
                  investorsNum: 5,
                  leadInvestors: ["abc", "zxc"],
                }}
                tags={[
                  {
                    text: "tag 1",
                    to: "#0",
                  },
                  {
                    text: "tag 2",
                  },
                ]}
              />
              <InvestmentPreview
                className="mb-3"
                linkToDetails="#0"
                moneyGoal={"400€"}
                currentValuation={"4000€"}
                tokenPrice={"2€"}
                neuInvestorsNum={500}
                startingOn="22.12.2019"
                handleEmailSend={() => {}}
                endInDays={25}
                company={"Superawesome startup 2"}
                hasStarted={true}
                detailsLink="#0"
                preFoundingStatus={{
                  money: "€ 50M",
                  investorsNum: 5,
                  leadInvestors: ["abc", "zxc"],
                }}
                tags={[
                  {
                    text: "tag 1",
                    to: "#0",
                  },
                  {
                    text: "tag 2",
                  },
                ]}
              />
              <InvestmentPreview
                linkToDetails="#0"
                moneyGoal={"400€"}
                currentValuation={"4000€"}
                tokenPrice={"2€"}
                neuInvestorsNum={500}
                startingOn="22.12.2019"
                handleEmailSend={() => {}}
                endInDays={25}
                company={"Superawesome startup 2"}
                hasStarted={true}
                detailsLink="#0"
                preFoundingStatus={{
                  money: "€ 50M",
                  investorsNum: 5,
                  leadInvestors: ["abc", "zxc"],
                }}
                tags={[
                  {
                    text: "tag 1",
                    to: "#0",
                  },
                  {
                    text: "tag 2",
                  },
                ]}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
});
