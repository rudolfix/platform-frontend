import * as React from "react";
import { Col, Row } from "reactstrap";

import * as cn from "classnames";
import * as ethIcom from "../../../assets/img/eth_icon.svg";
import * as moneyIcom from "../../../assets/img/nEUR_icon.svg";
import { ArrowLink } from "../../shared/ArrowLink";
import { PanelDark } from "../../shared/PanelDark";
import * as styles from "./MyWalletWidget.module.scss";

interface IMoneySuiteWidgetProps {
  icon: string;
  largeNo: string;
}

const MoneySuiteWidget: React.SFC<
  IMoneySuiteWidgetProps & React.HTMLAttributes<HTMLDivElement>
> = ({ icon, largeNo, children, className }) => (
  <Row className={cn("mt-2 mb-2 justify-content-center", className)} noGutters>
    <Col className="col-auto">
      <img className={styles.icon} src={icon} />
    </Col>
    <Col className="pl-2 col-sm-auto col-lg">
      <div className={styles.largeDarkFont}>{largeNo}</div>
      <div>{children}</div>
    </Col>
    <Col xs={12} className="mt-3">
      <div className={styles.border} />
    </Col>
  </Row>
);
export const MyWalletWidget = () => {
  return (
    <PanelDark
      headerText="My Wallet"
      rightComponent={
        <ArrowLink
          arrowDirection="right"
          to="#"
          className={cn(styles.link, "text-light mb-1 pl-0 pr-0 pb-1 d-none d-sm-block text-right")}
        >
          Manage Wallet
        </ArrowLink>
      }
      className="bg-white"
    >
      <Row noGutters>
        <Col xs={12} sm={6} lg={12} className="mt-2">
          <MoneySuiteWidget largeNo="nEUR 36 490" icon={moneyIcom} className={styles.borderRight}>
            = 36 490 EUR
          </MoneySuiteWidget>
        </Col>
        <Col xs={12} sm={6} lg={12} className="mt-2">
          <MoneySuiteWidget largeNo="ETH 6.6482" icon={ethIcom}>
            <Row className="align-self-center">
              <div className="ml-3">= 600 490.4646 EUR</div>
              <div className={cn(styles.smallRedFont, "ml-2")}> (-3.67%) </div>
            </Row>
          </MoneySuiteWidget>
        </Col>
        <Col xs={12}>
          <div className={styles.borderS} />
        </Col>
      </Row>
      <Row className="mb-3 ml-2 justify-content-between mt-2" noGutters>
        <Col className="d-flex align-items-center">
          <span className={cn(styles.smallFont)}>TOTAL</span>
          <span className={cn(styles.mediumSeaweedFont, "ml-2 m-0")}>637 238 </span>
          <span className={cn(styles.smallSeaweedFont, "pl-1")}>EUR</span>
        </Col>
        <Col xs={6} className="d-block d-sm-none text-right">
          <ArrowLink arrowDirection="right" to="#" className={cn(styles.link, "p-0 pb-1")}>
            Manage Wallet
          </ArrowLink>
        </Col>
      </Row>
    </PanelDark>
  );
};
