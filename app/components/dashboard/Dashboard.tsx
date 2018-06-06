import * as React from "react";
import { Col, Row } from "reactstrap";

import { etoCompaniesCards } from "../../data/etoCompanies";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { EtoCard } from "../shared/EtoCard";
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
      {etoCompaniesCards.map(eto => (
        <Col xs={12} lg={6} xl={4}>
          <EtoCard {...eto} />
        </Col>
      ))}
    </Row>

    {process.env.NF_USER_INFO_COMPONENT_ENABLED === "1" && <UserInfo />}
  </LayoutAuthorized>
);
