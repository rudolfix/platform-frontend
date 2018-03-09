import * as React from "react";
import { Col, Row } from "reactstrap";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { MessageSignModal } from "../modals/SignMessageModal";
import { MyPortfolio } from "./myPortfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./myWallet/MyWalletWidget";
import { NotificationWidget } from "./notification-widget/NotificationWidget";
import { UserInfo } from "./UserInfo";

export const Dashboard = () => (
  <LayoutAuthorized>
    <NotificationWidget />
    <MessageSignModal />
    <Row className="p-3">
      <Col lg={8} xs={12}>
        <MyPortfolio />
      </Col>
      <Col>
        <MyWalletWidget />
      </Col>
    </Row>
    <br />
    <br />
    <br />
    <br />
    <UserInfo />
  </LayoutAuthorized>
);
