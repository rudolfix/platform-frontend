import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { dummyIntl } from "../utils/injectIntlHelpers.fixtures";
import { MyPortfolioWidgetComponent } from "./dashboard/myPortfolio/MyPortfolioWidget";
import { MyWalletWidgetComponent } from "./dashboard/myWallet/MyWalletWidget";
import { BackupSeedWidgetComponent } from "./settings/backupSeed/BackupSeedWidget";
import { ChangeEmailComponent } from "./settings/changeEmail/ChangeEmail";
import { VerifyEmailWidgetComponent } from "./settings/verifyEmail/VerifyEmailWidget";
import { InvestmentPreview } from "./shared/InvestmentPreview";
import { NavigationButton, NavigationLink } from "./shared/Navigation";
import { NewsWidget } from "./shared/NewsWidget";
import { Tabs } from "./shared/Tabs";

import * as styles from "./Demo.module.scss";

export const Demo: React.SFC = () => (
  <div className={styles.demoWrapper}>
    <Container>
      <Row>
        <Col>
          <MyPortfolioWidgetComponent isLoading />
        </Col>
      </Row>
    </Container>
    <Container>
      <Row>
        <Col>
          <MyPortfolioWidgetComponent
            isLoading={false}
            data={{ balanceEur: "36490" + "0".repeat(18), balanceNeu: "1000" + "0".repeat(18) }}
          />
        </Col>
      </Row>
    </Container>
    <Container>
      <Row>
        <Col>
          <MyPortfolioWidgetComponent isLoading={false} error="Something went wrong!" />
        </Col>
      </Row>
    </Container>
    <Container>
      <Row>
        <Col>
          <MyPortfolioWidgetComponent
            isLoading={false}
            data={{ balanceEur: "0", balanceNeu: "0" }}
          />
        </Col>
      </Row>
    </Container>
    <Container>
      <Row noGutters>
        <Col>
          <MyWalletWidgetComponent
            isLoading={false}
            data={{
              euroTokenAmount: "36490" + "0".repeat(18),
              ethAmount: "66482" + "0".repeat(14),
              ethEuroAmount: "6004904646" + "0".repeat(16),
              totalAmount: "637238" + "0".repeat(18),
            }}
          />
        </Col>
      </Row>
    </Container>
    <Container>
      <Row noGutters>
        <Col>
          <MyWalletWidgetComponent isLoading={false} error="Error while loading wallet data." />
        </Col>
      </Row>
    </Container>
    <Container>
      <Row>
        <Col lg={6} xs={12}>
          <VerifyEmailWidgetComponent
            step={1}
            isUserEmailVerified={false}
            isThereUnverifiedEmail={true}
            resendEmail={() => {}}
            addNewEmail={() => {}}
            intl={dummyIntl}
          />
        </Col>
        <Col lg={6} xs={12}>
          <VerifyEmailWidgetComponent
            step={1}
            isUserEmailVerified={true}
            isThereUnverifiedEmail={true}
            resendEmail={() => {}}
            addNewEmail={() => {}}
            intl={dummyIntl}
          />
        </Col>
      </Row>
    </Container>
    <Container>
      <Row>
        <Col lg={6} xs={12}>
          <BackupSeedWidgetComponent step={1} intl={dummyIntl} />
        </Col>
        <Col lg={6} xs={12}>
          <BackupSeedWidgetComponent step={1} backupCodesVerified intl={dummyIntl} />
        </Col>
      </Row>
    </Container>
    <Container>
      <ChangeEmailComponent submitForm={() => {}} intl={dummyIntl} />
    </Container>
    <Container>
      <InvestmentPreview
        linkToDetails="#0"
        moneyGoal={"400€"}
        currentValuation={"4000€"}
        tokenPrice={"2€"}
        neuInvestorsNum={500}
        startingOn="22.12.2019"
        handleEmailSend={() => {}}
        endInDays={25}
        company={"Superawesome startup two"}
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
        company={"Superawesome startup one"}
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
    </Container>
    <Container>
      <Tabs
        theme="dark"
        tabs={[
          { text: "tab 1", path: "/demo" },
          { text: "tab 2", path: "" },
          { text: "tab 3", path: "" },
        ]}
      />
      <Tabs
        style={{ background: "black" }}
        theme="light"
        tabs={[
          { text: "tab 1", path: "" },
          { text: "tab 2", path: "" },
          { text: "tab 3", path: "" },
        ]}
      />
    </Container>
    <Container>
      <Row>
        <Col>
          <NewsWidget
            className="h-100"
            isEditable={true}
            activeTab="news"
            news={[
              {
                title:
                  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo ea dicta",
                url: "asdf asdfffa sad",
              },
              {
                title:
                  "inventore natus aliquam beatae unde? Tenetur consequatur optio a consequuntur, earum nihil autem nemo rem aliquam! Perspiciatis, debitis iure?",
                url: "asdf asdad as sdd",
              },
            ]}
          />
        </Col>
        <Col>
          <NewsWidget
            className="h-100"
            isEditable={false}
            activeTab="twitter"
            news={[
              {
                title:
                  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo ea dicta",
                url: "asdf asdfffa sad",
              },
              {
                title:
                  "inventore natus aliquam beatae unde? Tenetur consequatur optio a consequuntur, earum nihil autem nemo rem aliquam! Perspiciatis, debitis iure?",
                url: "asdf asdad as sdd",
              },
            ]}
          />
        </Col>
      </Row>
    </Container>
  </div>
);
