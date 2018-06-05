import * as React from "react";
import { Col, Row } from "reactstrap";

import { sampleCard } from "../landing/Landing";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { EtoOfferingCard } from "../shared/EtoOfferingCard";
import { EtoOfferingSoon } from "../shared/EtoOfferingSoon";
import { MyPortfolioWidget } from "./myPortfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./myWallet/MyWalletWidget";
import { UserInfo } from "./UserInfo";

export const Dashboard = () => (
  <LayoutAuthorized>
    <Row className="row-gutter-top">
      <Col lg={8} xs={12}>
        <MyPortfolioWidget className="h-100" />
      </Col>
      <Col>
        <MyWalletWidget className="h-100" />
      </Col>
    </Row>

    <Row className="row-gutter-top mb-4">
      <Col xs={12} lg={4}>
        <EtoOfferingCard {...sampleCard} />
      </Col>
      <Col xs={12} lg={4}>
        <EtoOfferingCard {...sampleCard} />
      </Col>
      <Col xs={12} lg={4}>
        <EtoOfferingCard {...sampleCard} />
      </Col>
      <Col xs={12} lg={4}>
        <EtoOfferingSoon description="The most exciting company working with the creative community to create original content generation for the worlds leading brands. " />
      </Col>
    </Row>

    {process.env.NF_USER_INFO_COMPONENT_ENABLED === "1" && <UserInfo />}
  </LayoutAuthorized>
);
