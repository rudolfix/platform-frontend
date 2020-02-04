import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import {
  selectIcbmWalletConnected,
  selectLockedWalletConnected,
  selectTotalEtherBalance,
  selectTotalEtherBalanceEuroAmount,
  selectTotalEuroBalance,
  selectTotalEuroTokenBalance,
} from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { EColumnSpan } from "../../layouts/Container";
import { DataRow } from "../../modals/tx-sender/shared/DataRow";
import { EButtonLayout } from "../../shared/buttons";
import { Button, EButtonSize, EButtonWidth } from "../../shared/buttons/Button";
import { ButtonInline } from "../../shared/buttons/ButtonInline";
import { Money } from "../../shared/formatters/Money";
import { ECurrency, ENumberInputFormat, ENumberOutputFormat } from "../../shared/formatters/utils";
import { TokenIcon } from "../../shared/icons/TokenIcon";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget/MoneySuiteWidget";
import { PanelRounded } from "../../shared/Panel";
import { ECustomTooltipTextPosition, Tooltip } from "../../shared/tooltips";
import { WarningAlert } from "../../shared/WarningAlert";

import ethIcon from "../../../assets/img/eth_icon.svg";
import moneyIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./MyWalletWidget.module.scss";

type TStateProps = {
  isLoading: boolean;
  error?: string;
  data?: {
    euroTokenAmount: string;
    ethAmount: string;
    ethEuroAmount: string;
    totalAmount: string;
    isIcbmWalletConnected: boolean;
    isLockedWalletConnected: boolean;
  };
};

type TDispatchProps = {
  goToWallet: () => void;
  goToPortfolio: () => void;
};

type TComponentProps = TStateProps & TDispatchProps;

export const MyWalletWidgetComponentBody: React.FunctionComponent<TComponentProps> = props => {
  if (props.isLoading) {
    return <LoadingIndicator className="m-auto" />;
  } else if (props.error) {
    return (
      <WarningAlert data-test-id="my-wallet-error" className="m-auto">
        <FormattedMessage id="common.error" values={{ separator: <br /> }} />
      </WarningAlert>
    );
  } else {
    const {
      euroTokenAmount,
      ethAmount,
      ethEuroAmount,
      isIcbmWalletConnected,
      isLockedWalletConnected,
    } = props.data!;

    return (
      <>
        <DataRow
          className={styles.row}
          caption={
            <>
              <TokenIcon srcSet={{ "1x": moneyIcon }} alt="" className={cn("mr-2", styles.token)} />
              <span className={styles.tokenName}>
                <FormattedMessage id="dashboard.my-wallet.neuro" />
              </span>
            </>
          }
          value={
            <MoneySuiteWidget
              currency={ECurrency.EUR_TOKEN}
              largeNumber={euroTokenAmount}
              value={euroTokenAmount}
              currencyTotal={ECurrency.EUR}
              outputFormat={ENumberOutputFormat.FULL}
              data-test-id="my-wallet-widget-eur-token"
            />
          }
        />
        <DataRow
          className={styles.row}
          caption={
            <>
              <TokenIcon srcSet={{ "1x": ethIcon }} alt="" className={cn("mr-2", styles.token)} />
              <span className={styles.tokenName}>
                <FormattedMessage id="dashboard.my-wallet.ether" />
              </span>
            </>
          }
          value={
            <MoneySuiteWidget
              currency={ECurrency.ETH}
              largeNumber={ethAmount}
              value={ethEuroAmount}
              currencyTotal={ECurrency.EUR}
              outputFormat={ENumberOutputFormat.FULL}
              data-test-id="my-wallet-widget-eth-token"
            />
          }
        />
        {process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED === "1" &&
          process.env.NF_CHECK_LOCKED_WALLET_WIDGET_IN_DASHBOARD === "1" &&
          !(isIcbmWalletConnected || isLockedWalletConnected) && (
            <section data-test-id="my-wallet-widget-icbm-help-text">
              <p className={styles.icbmWallet}>
                <FormattedMessage id="dashboard.my-portfolio-widget.cant-see-your-icbm-wallet" />
                <br />
                <ButtonInline onClick={props.goToPortfolio}>
                  <FormattedMessage id="dashboard.my-portfolio-widget.check-it-here" />
                </ButtonInline>
                <Tooltip
                  content={<FormattedMessage id="icbm-wallet.tooltip" />}
                  textPosition={ECustomTooltipTextPosition.LEFT}
                />
              </p>
            </section>
          )}
        <Button
          className={styles.button}
          layout={EButtonLayout.PRIMARY}
          size={EButtonSize.SMALL}
          width={EButtonWidth.NORMAL}
          onClick={props.goToWallet}
        >
          <FormattedMessage id="dashboard.my-wallet.manage-wallet" />
        </Button>
      </>
    );
  }
};

export const MyWalletWidgetComponent: React.FunctionComponent<CommonHtmlProps &
  TComponentProps> = ({ ...props }) => (
  <PanelRounded columnSpan={EColumnSpan.ONE_COL} className={styles.container}>
    <DataRow
      className={styles.header}
      caption={
        <h4 className={styles.title}>
          <FormattedMessage id="dashboard.my-wallet.title" />
        </h4>
      }
      value={
        !props.isLoading &&
        !props.error &&
        props.data && (
          <Money
            data-test-id="my-wallet-widget-total"
            value={props.data.totalAmount}
            inputFormat={ENumberInputFormat.ULPS}
            valueType={ECurrency.EUR}
            outputFormat={ENumberOutputFormat.FULL}
          />
        )
      }
    />
    <MyWalletWidgetComponentBody {...props} />
  </PanelRounded>
);

export const MyWalletWidget = compose<TComponentProps, CommonHtmlProps>(
  onEnterAction({ actionCreator: d => d(actions.wallet.loadWalletData()) }),
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => {
      const isLoading = state.wallet.loading;
      const error = state.wallet.error;

      if (!isLoading && !error) {
        return {
          isLoading,
          error,
          data: {
            euroTokenAmount: selectTotalEuroTokenBalance(state),
            ethAmount: selectTotalEtherBalance(state),
            ethEuroAmount: selectTotalEtherBalanceEuroAmount(state),
            totalAmount: selectTotalEuroBalance(state),
            isIcbmWalletConnected: selectIcbmWalletConnected(state.wallet),
            isLockedWalletConnected: selectLockedWalletConnected(state),
          },
        };
      } else {
        return {
          isLoading,
          error,
        };
      }
    },
    dispatchToProps: dispatch => ({
      goToWallet: () => dispatch(actions.routing.goToWallet()),
      goToPortfolio: () => dispatch(actions.routing.goToPortfolio()),
    }),
  }),
)(MyWalletWidgetComponent);
