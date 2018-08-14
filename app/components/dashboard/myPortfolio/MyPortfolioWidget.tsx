import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { selectNeuBalanceEuroAmount } from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";
import { MyNeuWidget } from "./MyNeuWidget";

import { appRoutes } from "../../appRoutes";
import * as styles from "./MyPortfolioWidget.module.scss";

type TOwnProps = CommonHtmlProps;

interface IBodyProps {
  error?: string;
  data?: {
    balanceNeu: string;
    balanceEur: string;
    isIcbmWalletConnected?: boolean;
  };
}

interface IStateProps extends IBodyProps {
  isLoading: boolean;
}

type IProps = TOwnProps & IStateProps;

export const MyPortfolioWidgetComponentBody: React.SFC<IBodyProps> = ({ error, data }) => {
  if (error) {
    return <WarningAlert>{error}</WarningAlert>;
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.main}>
        <h3>
          <FormattedMessage id="dashboard.my-portfolio-widget.welcome" />
        </h3>
        {data && data.isIcbmWalletConnected ? (
          <p>
            <FormattedMessage id="dashboard.my-portfolio-widget.cant-see-your-icbm-wallet" />{" "}
            <Link to={appRoutes.settings} className={styles.link}>
              <FormattedMessage id="dashboard.my-portfolio-widget.check-it-here" />
            </Link>
          </p>
        ) : null}
      </div>
      <div className={styles.side}>
        <MyNeuWidget balanceNeu={data!.balanceNeu} balanceEur={data!.balanceEur} />
      </div>
    </div>
  );
};

export const MyPortfolioWidgetComponent: React.SFC<IProps> = ({
  className,
  style,
  isLoading,
  error,
  data,
}) => {
  return (
    <Panel
      headerText={
        <FormattedMessage id="components.dashboard.my-portfolio.my-portfolio-widget.header-text" />
      }
      className={className}
      style={style}
    >
      <>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <MyPortfolioWidgetComponentBody
            data={data}
            error={error}
            test-data-id="dashboard-my-portfolio-widget"
          />
        )}
      </>
    </Panel>
  );
};

export const MyPortfolioWidget = appConnect<IStateProps, {}, TOwnProps>({
  stateToProps: s => ({
    isLoading: s.wallet.loading,
    error: s.wallet.error,
    data: s.wallet.data && {
      isIcbmWalletConnected: !!s.wallet.data.euroTokenICBMLockedBalance,
      balanceNeu: s.wallet.data.neuBalance,
      balanceEur: selectNeuBalanceEuroAmount(s.wallet.data),
    },
  }),
})(MyPortfolioWidgetComponent);
