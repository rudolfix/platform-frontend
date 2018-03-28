import * as React from "react";
import { Col, Row } from "reactstrap";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { MyPortfolio } from "./myPortfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./myWallet/MyWalletWidget";
import { UserInfo } from "./UserInfo";

export const Dashboard = () => (
  <LayoutAuthorized>
    <Row className="row-gutter-top">
      <Col lg={8} xs={12}>
        <MyPortfolio className="h-100" />
      </Col>
      <Col>
        <MyWalletWidget className="h-100" />
      </Col>
    </Row>
    <br />
    <br />
    <br />
    <br />
    <UserInfo />
  </LayoutAuthorized>
);
