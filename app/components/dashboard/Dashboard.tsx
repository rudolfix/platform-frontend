import * as React from "react";
import { Col, Row } from "reactstrap";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SectionHeader } from "../shared/SectionHeader";
import { Tag } from "../shared/Tag";
import { InvestmentPreview } from "./investmentOportunities/InvestmentPreview";
import { MyPortfolio } from "./myPortfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./myWallet/MyWalletWidget";
import { NeufundKpiWidget } from "./NeufundKpiWidget";
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
    <Row>
      <Col lg={8} xs={12}>
        <NeufundKpiWidget />
      </Col>
    </Row>
    <SectionHeader>
      investment opportunities{" "}
      <Tag className="ml-3" color="green" layout="ghost" size="small" text="1 new" />
    </SectionHeader>
    <Row className="py-4">
      <Col xs={12} className="pb-2">
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
      <Col xs={12} className="pb-2">
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
          hasStarted={false}
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
    <br />
    <br />
    <br />
    <br />
    <UserInfo />
  </LayoutAuthorized>
);
