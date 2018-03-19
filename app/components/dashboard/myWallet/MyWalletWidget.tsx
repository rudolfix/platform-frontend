import * as React from "react";
import { Col, Row } from "reactstrap";

import * as cn from "classnames";
import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";
import { ArrowLink } from "../../shared/ArrowNavigation";
import { Money } from "../../shared/Money";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";
import { PanelDark } from "../../shared/PanelDark";
import * as styles from "./MyWalletWidget.module.scss";

interface IMyWalletWidget {
  euroTokenAmount: string;
  euroTokenEuroAmount: string;
  ethAmount: string;
  ethEuroAmount: string;
  percentage: string;
  totalAmount: string;
}

export const MyWalletWidget: React.SFC<IMyWalletWidget> = ({
  euroTokenAmount,
  ethAmount,
  ethEuroAmount,
  percentage,
  totalAmount,
  euroTokenEuroAmount,
}) => {
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
    >
      <Row noGutters>
        <Col className={styles.moneySuiteWrapper} xs={12} sm={6} lg={12}>
          <MoneySuiteWidget
            currency="eur_token"
            largeNumber={euroTokenAmount}
            icon={moneyIcon}
            data-test-id="euro-widget"
            value={euroTokenEuroAmount}
            percentage={percentage}
          />
        </Col>
        <Col className={styles.moneySuiteWrapper} xs={12} sm={6} lg={12}>
          <MoneySuiteWidget
            currency="eth"
            largeNumber={ethAmount}
            icon={ethIcon}
            data-test-id="eth-widget"
            className={cn(styles.borderLeft, "pl-sm-2 pl-md-0")}
            value={ethEuroAmount}
            percentage={percentage}
          />
        </Col>
      </Row>
      <Row data-test-id="total-widget">
        <Col>
          <div className={`${styles.total} mt-3 mb-3 d-flex align-items-center`}>
            <span className={cn(styles.smallFont)}>TOTAL</span>
            <Money
              value={totalAmount}
              currency="eur"
              noCurrencySymbol
              className={cn(styles.money, "pl-1 pl-sm-2 m-0")}
            />
            <span className={"pl-1"}>EUR</span>
          </div>
        </Col>
        <Col className="d-block d-sm-none text-right col-auto">
          <ArrowLink arrowDirection="right" to="#" className={cn(styles.link, "p-0 m-0 mt-3 mb-3")}>
            Manage
          </ArrowLink>
        </Col>
      </Row>
    </PanelDark>
  );
};
