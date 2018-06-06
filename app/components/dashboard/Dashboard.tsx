import * as React from "react";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { EtoList } from "./eto-list/EtoList";
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

      {process.env.NF_EQUITY_TOKEN_OFFERINGS_VISIBLE === "1" && <EtoList />}
    </Row>

    {process.env.NF_USER_INFO_COMPONENT_ENABLED === "1" && <UserInfo />}
  </LayoutAuthorized>
);
