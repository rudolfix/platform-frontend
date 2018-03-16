import * as React from "react";
import { Col, Row } from "reactstrap";

import * as cn from "classnames";
import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";
import { ArrowLink } from "../../shared/ArrowLink";
import { Money, selectCurrencySymbol, TCurrency } from "../../shared/Money";
import { PanelDark } from "../../shared/PanelDark";
import * as styles from "./MyWalletWidget.module.scss";

interface IMoneySuiteWidgetProps {
  icon: string;
  currency: TCurrency;
  largeNumber: string;
}

const MoneySuiteWidget: React.SFC<
  IMoneySuiteWidgetProps & React.HTMLAttributes<HTMLDivElement>
> = ({ icon, currency, largeNumber, children, className }) => (
  <>
    <div
      className={cn(
        "mt-2 pt-1 d-flex justify-content-sm-center justify-content-lg-start noGutters",
        className,
      )}
    >
      <span>
        <img className={styles.icon} src={icon} />
        <span className={cn(styles.largeDarkFont, "align-middle pl-2")}>
          {selectCurrencySymbol(currency)}{" "}
          <Money value={largeNumber} currency={currency} noCurrencySymbol />
        </span>
        <div className="ml-3 pl-4">{children}</div>
      </span>
    </div>
    <div className={cn(styles.border, "mt-2")} />
  </>
);

interface IMyWalletWidget {
  euroTokenAmount: string;
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
      className={cn(styles.background)}
    >
      <Row noGutters>
        <Col xs={12} sm={6} lg={12}>
          <MoneySuiteWidget
            currency="eur_token"
            largeNumber={euroTokenAmount}
            icon={moneyIcon}
            data-test-id="euro-widget"
          >
            = <Money value={euroTokenAmount} currency="eur" />
          </MoneySuiteWidget>
        </Col>
        <Col xs={12} sm={6} lg={12}>
          <MoneySuiteWidget
            currency="eth"
            largeNumber={ethAmount}
            icon={ethIcon}
            data-test-id="eth-widget"
            className={cn(styles.borderLeft, "pl-sm-2 pl-md-0")}
          >
            <span>
              = <Money value={ethEuroAmount} currency="eur" className="" />
              <span className={cn(styles.smallRedFont, "pl-2 pl-sm-0 pl-md-1")}>
                {" "}
                ({percentage}%)
              </span>
            </span>
          </MoneySuiteWidget>
        </Col>
        <Col xs={12}>
          <div className={styles.borderS} />
        </Col>
      </Row>
      <Row data-test-id="total-widget">
        <Col>
          <div className="mt-3 mb-3 d-flex align-items-center">
            <span className={cn(styles.smallFont)}>TOTAL</span>
            <Money
              value={totalAmount}
              currency="eur"
              noCurrencySymbol
              className={cn(styles.mediumSeaweedFont, "pl-1 pl-sm-2 m-0")}
            />
            <span className={cn(styles.smallSeaweedFont, "pl-1")}>EUR</span>
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
