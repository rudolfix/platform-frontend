import * as React from "react";
import { Col, Container, FormFeedback, FormGroup, Input, Row } from "reactstrap";

import * as styles from "./Demo.module.scss";

import { ArrowLink } from "./shared/ArrowLink";

import { MyPortfolio } from "./dashboard/myPortfolio/MyPortfolioWidget";
import { VerifyEmailWidgetComponent } from "./settings/VerifyEmailWidget";
import { MyWalletWidget } from "./dashboard/myWallet/MyWalletWidget";
import {
  ButtonPrimary,
  ButtonPrimaryLink,
  ButtonSecondary,
  ButtonSecondaryLink,
} from "./shared/Buttons";
import { Money } from "./shared/Money";
import { NavigationButton, NavigationLink } from "./shared/Navigation";
import { PanelDark } from "./shared/PanelDark";
import { PanelWhite } from "./shared/PanelWhite";

export const Demo: React.SFC = () => (
  <div className={styles.demoWrapper}>
    <Container>
      <Row>
        <Col>
          <ButtonPrimary>ButtonPrimary</ButtonPrimary>
          <ButtonPrimary disabled>ButtonPrimary disabled</ButtonPrimary>
          <ButtonPrimaryLink to="/">ButtonPrimaryLink</ButtonPrimaryLink>
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <ButtonSecondary>ButtonSecondary</ButtonSecondary>
          <ButtonSecondary disabled>ButtonSecondary disabled</ButtonSecondary>
          <ButtonSecondaryLink to="/">ButtonSecondary link</ButtonSecondaryLink>
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
              So this is our white panel. It can contain React.Nodes as children and no Props:
            </p>
            <dl>
              <dt>headerText: string</dt>
              <dd>Title of panel it will be rendered in span element</dd>
              <dt>rightComponent: ReactNode</dt>
              <dd>Component that will be put in header on right side.</dd>
            </dl>
          </PanelWhite>
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <ArrowLink arrowDirection="right" to="#">
            Right arrow link
          </ArrowLink>
          <ArrowLink arrowDirection="left" to="#">
            Left arrow link
          </ArrowLink>
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
            euroTokenAmount={"36490" + "0".repeat(18)}
            euroTokenEuroAmount={"36490" + "0".repeat(18)}
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
  </div>
);
