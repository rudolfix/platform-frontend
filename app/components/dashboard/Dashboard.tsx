import * as React from "react";
import { Col, Row } from "reactstrap";

import {
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLiquidEuroTokenBalance,
  selectLiquidEuroTotalAmount,
} from "../../modules/wallet/selectors";
import { appConnect } from "../../store";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { MessageSignModal } from "../modals/SignMessageModal";
import { SectionHeader } from "../shared/SectionHeader";
import { Tag } from "../shared/Tag";
import { InvestmentPreview } from "./investmentOportunities/InvestmentPreview";
import { MyPortfolio } from "./myPortfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./myWallet/MyWalletWidget";
import { UserInfo } from "./UserInfo";

interface IStateProps {
  liquidEtherBalance: string;
  liquidEtherBalanceEuroAmount: string;
  liquidEuroTokenBalance: string;
  liquidEuroTotalAmount: string;
}

type IProps = IStateProps;

export const DashboardComponent = (props: IProps) => (
  <LayoutAuthorized>
    <MessageSignModal />
    <Row className="py-4">
      <Col lg={8} xs={12}>
        <MyPortfolio />
      </Col>
      <Col>
        <MyWalletWidget
          euroTokenEuroAmount={props.liquidEuroTokenBalance}
          euroTokenAmount={props.liquidEuroTokenBalance}
          ethAmount={props.liquidEtherBalance}
          ethEuroAmount={props.liquidEtherBalanceEuroAmount}
          percentage="0" // TODO connect 24h change
          totalAmount={props.liquidEuroTotalAmount}
        />
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

export const Dashboard = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    liquidEtherBalance: selectLiquidEtherBalance(s.wallet),
    liquidEuroTokenBalance: selectLiquidEuroTokenBalance(s.wallet),
    liquidEtherBalanceEuroAmount: selectLiquidEtherBalanceEuroAmount(s.wallet),
    liquidEuroTotalAmount: selectLiquidEuroTotalAmount(s.wallet),
  }),
})(DashboardComponent);
