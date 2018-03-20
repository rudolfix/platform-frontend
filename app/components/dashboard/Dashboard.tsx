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
import { MyPortfolio } from "./myPortfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./myWallet/MyWalletWidget";
import { NotificationWidget } from "./notification-widget/NotificationWidget";
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
    <NotificationWidget />
    <MessageSignModal />
    <Row className="p-3">
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
