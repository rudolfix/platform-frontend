import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SectionHeader } from "../shared/SectionHeader";
import { Tag } from "../shared/Tag";
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
      <Col lg={8} xs={12} />
      <Col lg={4} xs={12} />
    </Row>
    <SectionHeader>
      <FormattedMessage id="dashboard.start-page.investment-opportunities" />
      <Tag className="ml-3" theme="green" layout="ghost" size="small" text="1 new" />
    </SectionHeader>

    {process.env.NF_USER_INFO_COMPONENT_ENABLED === "1" && <UserInfo />}
  </LayoutAuthorized>
);
