import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { InvestmentPreview } from "../shared/InvestmentPreview";
import { NewsWidget } from "../shared/NewsWidget";
import { SectionHeader } from "../shared/SectionHeader";
import { Tag } from "../shared/Tag";
import { MyPortfolioWidget } from "./myPortfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./myWallet/MyWalletWidget";
import { NeufundKpiWidget } from "./NeufundKpiWidget";
import { UserInfo } from "./UserInfo";

const chartPieData = {
  labels: ["Lorem", "Ipsum", "Dit", "Sit", "Amet", "Blah"],
  datasets: [
    {
      data: [100, 50, 20, 40, 50, 12],
      backgroundColor: ["#394651", "#c4c5c6", "#616611", "#9fa914", "#d5e20f", "#0b0e11"],
    },
  ],
};

const chartBarData = {
  labels: ["Lorem", "Ipsum", "Dit", "Sit", "Amet", "Blah"],
  datasets: [
    {
      data: [100, 50, 20, 40, 50, 12],
      backgroundColor: ["#394651", "#c4c5c6", "#616611", "#9fa914", "#d5e20f", "#0b0e11"],
    },
  ],
};

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
      <Col lg={8} xs={12}>
        <NeufundKpiWidget
          date="12 Sep. 2018"
          tokenHolders={12}
          investorsNum={5}
          etosNum={20}
          currency="eur"
          totalCapitalDeployed={"5" + "0".repeat(26)}
          platformPortfolioValue={"2" + "0".repeat(22)}
          chartBarData={chartBarData}
          chartPieData={chartPieData}
          vcAccessible={"2" + "0".repeat(26)}
          totalProceeds={"2" + "0".repeat(24)}
          totalProceedsToken={"2" + "0".repeat(20)}
        />
      </Col>
      <Col lg={4} xs={12}>
        <NewsWidget
          className="h-100"
          isEditable={false}
          activeTab="news"
          news={[
            {
              title: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo ea dicta",
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
    <SectionHeader>
      <FormattedMessage id="dashboard.start-page.investment-opportunities" />
      <Tag className="ml-3" theme="green" layout="ghost" size="small" text="1 new" />
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
    {
      process.env.NF_USER_INFO_COMPONENT_ENABLED === "1" && <UserInfo />
    }
  </LayoutAuthorized>
);
