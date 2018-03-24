import * as React from "react";
import { Col, Row } from "reactstrap";

import * as cn from "classnames";
import { compose } from "redux";
import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";
import { actions } from "../../../modules/actions";
import {
  selectLiquidEtherBalanceEuroAmount,
  selectLiquidEuroTokenBalance,
  selectLiquidEuroTotalAmount,
} from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { appRoutes } from "../../AppRouter";
import { ArrowLink } from "../../shared/ArrowNavigation";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { Money } from "../../shared/Money";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";
import { PanelDark } from "../../shared/PanelDark";
import { WarningAlert } from "../../shared/WarningAlert";
import * as styles from "./MyWalletWidget.module.scss";

type StateProps = {
  isLoading: boolean;
  error?: string;
  data?: {
    euroTokenAmount: string;
    euroTokenEuroAmount: string;
    ethAmount: string;
    ethEuroAmount: string;
    percentage: string;
    totalAmount: string;
  };
};

export const MyWalletWidgetComponentBody: React.SFC<StateProps> = props => {
  if (props.isLoading) {
    return <LoadingIndicator />;
  } else if (props.error) {
    return <WarningAlert>{props.error}</WarningAlert>;
  } else {
    const {
      euroTokenAmount,
      euroTokenEuroAmount,
      percentage,
      ethAmount,
      ethEuroAmount,
      totalAmount,
    } = props.data!;

    return (
      <>
        <Row>
          <Col className={styles.moneySuiteWrapper} xs={12} sm={6} lg={12}>
            <MoneySuiteWidget
              currency="eur_token"
              largeNumber={euroTokenAmount}
              icon={moneyIcon}
              data-test-id="euro-widget"
              value={euroTokenEuroAmount}
              percentage={percentage}
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
              percentage={percentage}
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
            <ArrowLink
              arrowDirection="right"
              to="#"
              className={cn(styles.link, "p-0 m-0 mt-3 mb-3")}
            >
              Manage
            </ArrowLink>
          </Col>
        </Row>
      </>
    );
  }
};

export const MyWalletWidgetComponent: React.SFC<StateProps> = props => {
  return (
    <PanelDark
      headerText="My Wallet"
      rightComponent={
        <ArrowLink
          arrowDirection="right"
          to={appRoutes.manageWallet}
          className={cn(styles.link, "text-light mb-1 pl-0 pr-0 pb-1 d-none d-sm-block text-right")}
        >
          Manage Wallet
        </ArrowLink>
      }
    >
      <MyWalletWidgetComponentBody {...props} />
    </PanelDark>
  );
};

export const MyWalletWidget = compose<React.SFC>(
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
            euroTokenEuroAmount: selectLiquidEuroTokenBalance(walletData),
            euroTokenAmount: selectLiquidEuroTokenBalance(walletData),
            ethAmount: selectLiquidEtherBalanceEuroAmount(walletData),
            ethEuroAmount: selectLiquidEtherBalanceEuroAmount(walletData),
            percentage: "0", // TODO connect 24h change
            totalAmount: selectLiquidEuroTotalAmount(walletData),
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
