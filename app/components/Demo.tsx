import * as React from "react";
import { Col, Container, FormFeedback, FormGroup, Input, Row } from "reactstrap";

import * as styles from "./Demo.module.scss";

import { MyPortfolio } from "./dashboard/myPortfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./dashboard/myWallet/MyWalletWidget";
import { BackupSeedWidgetComponent } from "./settings/backupSeed/BackupSeedWidget";
import { ChangeEmailComponent } from "./settings/changeEmail/ChangeEmail";
import { KycStatusWidgetComponent } from "./settings/kycStates/KycStatusWidget";
import { VerifyEmailWidgetComponent } from "./settings/verifyEmail/VerifyEmailWidget";
import { BreadCrumb } from "./shared/BreadCrumb";
import { Button } from "./shared/Buttons";
import { Money } from "./shared/Money";
import { NavigationButton, NavigationLink } from "./shared/Navigation";
import { PanelDark } from "./shared/PanelDark";
import { PanelWhite } from "./shared/PanelWhite";
import { PercentageIndicatorBar } from "./shared/PercentageIndicatorBar";
import { SectionHeader } from "./shared/SectionHeader";
import { Tag } from "./shared/Tag";
import { InvestmentPreview } from "./dashboard/investmentOportunities/InvestmentPreview";

export const Demo: React.SFC = () => (
  <div className={styles.demoWrapper}>
    <Container>
      <Row>
        <Col>
          <Button>Default Button Primary</Button>
          <br />
          <Button disabled>Default Button Primary Disabled</Button>
          <br />
          <Button layout="secondary">Button Secondary</Button>
          <br />
          <Button layout="secondary" disabled>
            Button Secondary Disabled
          </Button>
        </Col>
      </Row>
    </Container>
    <Container>
      <Row>
        <Col>
          <a href="/">link</a>
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <NavigationButton forward text="NavigationButton" onClick={() => {}} />
          <NavigationButton disabled forward text="NavigationButton disabled" onClick={() => {}} />
          <NavigationLink forward to="/" text="NavigationLink" />
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>Breadcrumb in different states</Col>
      </Row>
      <Row>
        <Col>
          <BreadCrumb view={"no path just view name"} />
        </Col>
      </Row>
      <Row>
        <Col>
          <BreadCrumb path={["Single path"]} view={"view name"} />
        </Col>
      </Row>
      <Row>
        <Col>
          <BreadCrumb path={["First path", "Second path"]} view={"view name"} />
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <FormGroup>
            <Input placeholder={"This form is always invalid"} valid={false} />
            <FormFeedback>invalid</FormFeedback>
          </FormGroup>
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <PanelDark
            headerText="header text"
            rightComponent={
              <span style={{ height: "40px", backgroundColor: "red" }}>right component</span>
            }
          >
            <p>So this is our dark panel. It can contain React.Nodes as children and two props:</p>
            <dl>
              <dt>headerText: string</dt>
              <dd>Title of panel it will be rendered in span element</dd>
              <dt>rightComponent: ReactNode</dt>
              <dd>Component that will be put in header on right side.</dd>
            </dl>
          </PanelDark>
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <PanelWhite>
            <p className="mt-2">
              So this is our white panel. It can contain React.Nodes as children and no Props.
            </p>
          </PanelWhite>
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <Money
            currency="eth"
            value={"1234567" + "0".repeat(18)}
            style={{ fontSize: "25px" }}
            currencyStyle={{ fontSize: "18px", fontWeight: "bold" }}
          />
          <br />
          <Money
            currency="eur_token"
            value={"1234567" + "0".repeat(18)}
            style={{ fontSize: "25px" }}
            currencyStyle={{ fontSize: "18px", fontWeight: "bold" }}
          />
          <br />
          <Money
            currency="neu"
            value={"1234567" + "0".repeat(18)}
            style={{ fontSize: "25px" }}
            currencyStyle={{ fontSize: "18px", fontWeight: "bold" }}
          />
          <br />
          <Money currency="eth" value={"12345678" + "0".repeat(15)} doNotSeparateThousands />
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <MyPortfolio />
        </Col>
      </Row>
    </Container>

    <Container>
      <Row noGutters>
        <Col>
          <MyWalletWidget
            euroTokenEuroAmount={"6004904646" + "0".repeat(16)}
            euroTokenAmount={"36490" + "0".repeat(18)}
            ethAmount={"66482" + "0".repeat(14)}
            ethEuroAmount={"6004904646" + "0".repeat(16)}
            percentage="-3.67"
            totalAmount={"637238" + "0".repeat(18)}
          />
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col lg={6} xs={12}>
          <VerifyEmailWidgetComponent />
        </Col>
        <Col lg={6} xs={12}>
          <VerifyEmailWidgetComponent verifiedEmail="moe@test.co" />
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col lg={6} xs={12}>
          <BackupSeedWidgetComponent />
        </Col>
        <Col lg={6} xs={12}>
          <BackupSeedWidgetComponent backupCodesVerified />
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col lg={6} xs={12}>
          <KycStatusWidgetComponent onStartKyc={() => {}} />
        </Col>
        <Col lg={6} xs={12}>
          <KycStatusWidgetComponent onStartKyc={() => {}} />
        </Col>
      </Row>
    </Container>

    <Container>
      <ChangeEmailComponent submitForm={() => {}} />
    </Container>

    <Container>
      <PercentageIndicatorBar percent={79} />
    </Container>

    <Container>
      <Tag to="#0" text="tag" />
      <Tag layout="ghost" to="#0" text="ghost tag" />
      <Tag layout="ghost" size="small" to="#0" text="small ghost tag" />
      <Tag color="green" layout="ghost" size="small" to="#0" text="Small green ghost tag" />
    </Container>

    <Container>
      <SectionHeader>
        Section's Header
      </SectionHeader>
    </Container>

    <Container>
      <InvestmentPreview
        company={''}
        detailsLink="#0"
        preFoundingStatus={
          {
            money:"€ 50M",
            investorsNum: 5,
            leadInvestors: [
              'abc',
              'zxc'
            ]
          }
        }
        terms={
          {
            goal: 20000000,
            currentValuation: 4000000
          }
        }
        tags={
          [
            {
              text: 'tag 1',
              to: '#0'
            },
            {
              text: 'tag 2',
            }
          ]
        }
      />
    </Container>
  </div>
);
