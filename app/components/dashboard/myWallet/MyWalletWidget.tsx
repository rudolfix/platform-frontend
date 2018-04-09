import * as React from "react";
import { Col, Row } from "reactstrap";

import * as cn from "classnames";
import { Link } from "react-router-dom";
import { compose } from "redux";
import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";
import { actions } from "../../../modules/actions";
import {
  selectTotalEtherBalance,
  selectTotalEtherBalanceEuroAmount,
  selectTotalEuroBalance,
  selectTotalEuroTokenBalance,
} from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { Money } from "../../shared/Money";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";
import { PanelDark } from "../../shared/PanelDark";
import { WarningAlert } from "../../shared/WarningAlert";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import { CommonHtmlProps } from "../../../types";
import { appRoutes } from "../../AppRouter";
import * as styles from "./MyWalletWidget.module.scss";

type StateProps = {
  isLoading: boolean;
  error?: string;
  data?: {
    euroTokenAmount: string;
    ethAmount: string;
    ethEuroAmount: string;
    totalAmount: string;
  };
};

export const MyWalletWidgetComponentBody: React.SFC<StateProps> = props => {
  if (props.isLoading) {
    return <LoadingIndicator />;
  } else if (props.error) {
    return <WarningAlert>{props.error}</WarningAlert>;
  } else {
    const { euroTokenAmount, ethAmount, ethEuroAmount, totalAmount } = props.data!;

    return (
      <>
        <Row>
          <Col className={styles.moneySuiteWrapper} xs={12} sm={6} lg={12}>
            <MoneySuiteWidget
              currency="eur_token"
              largeNumber={euroTokenAmount}
              icon={moneyIcon}
              data-test-id="euro-widget"
              value={euroTokenAmount}
              currencyTotal={"eur"}
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
              currencyTotal={"eur"}
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
            <Link to={appRoutes.wallet}>
              <Button
                layout="secondary"
                iconPosition="icon-after"
                theme="t-white"
                svgIcon={arrowRight}
                className={cn(styles.link, "pr-0")}
              >
                Manage
              </Button>
            </Link>
          </Col>
        </Row>
      </>
    );
  }
};

export const MyWalletWidgetComponent: React.SFC<CommonHtmlProps & StateProps> = ({
  className,
  style,
  ...props
}) => {
  return (
    <PanelDark
      headerText="My Wallet"
      rightComponent={
        <Link to={appRoutes.wallet}>
          <Button
            layout="secondary"
            iconPosition="icon-after"
            theme="t-white"
            svgIcon={arrowRight}
            className={cn(styles.link, "pr-0")}
          >
            Manage Wallet
          </Button>
        </Link>
      }
      className={className}
      style={style}
    >
      <MyWalletWidgetComponentBody {...props} />
    </PanelDark>
  );
};

export const MyWalletWidget = compose<React.SFC<CommonHtmlProps>>(
  onEnterAction({ actionCreator: d => d(actions.wallet.startLoadingWalletData()) }),
  appConnect<StateProps>({
    stateToProps: s => {
      const isLoading = s.wallet.loading;
      const error = s.wallet.error;

      if (!isLoading && !error) {
        const walletData = s.wallet.data!;
        return {
          isLoading,
          error,
          data: {
            euroTokenAmount: selectTotalEuroTokenBalance(walletData),
            ethAmount: selectTotalEtherBalance(walletData),
            ethEuroAmount: selectTotalEtherBalanceEuroAmount(walletData),
            totalAmount: selectTotalEuroBalance(walletData),
          },
        };
      } else {
        return {
          isLoading,
          error,
        };
      }
    },
  }),
)(MyWalletWidgetComponent);
