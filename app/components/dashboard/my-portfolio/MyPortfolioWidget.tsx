import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { selectNeuBalance, selectNeuBalanceEuroAmount } from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";
import { MyNeuWidget } from "./MyNeuWidget";

import * as styles from "./MyPortfolioWidget.module.scss";

type TOwnProps = CommonHtmlProps;

interface IBodyProps {
  error?: string;
  balanceNeu: string;
  balanceEur: string;
}

interface IStateProps {
  isLoading: boolean;
  balanceNeu?: string;
  balanceEur?: string;
  error?: string;
}

type IProps = TOwnProps & IStateProps;

export const MyPortfolioWidgetComponentBody: React.FunctionComponent<IBodyProps> = ({
  error,
  balanceEur,
  balanceNeu,
}) => {
  if (error) {
    return <WarningAlert>{error}</WarningAlert>;
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.main}>
        <h3 className={styles.welcome}>
          <FormattedMessage id="dashboard.my-portfolio-widget.welcome" />
        </h3>
        <p>
          <FormattedMessage id="dashboard.my-portfolio-widget.explanation" />
        </p>
      </div>
      <MyNeuWidget balanceNeu={balanceNeu} balanceEur={balanceEur} />
    </div>
  );
};

export const MyPortfolioWidgetComponent: React.FunctionComponent<IProps> = ({
  className,
  style,
  isLoading,
  error,
  balanceEur,
  balanceNeu,
}) => {
  return (
    <Panel className={className} style={style}>
      <>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <MyPortfolioWidgetComponentBody
            {...{
              balanceEur: balanceEur!,
              balanceNeu: balanceNeu!,
            }}
            error={error}
            test-data-id="dashboard-my-portfolio-widget"
          />
        )}
      </>
    </Panel>
  );
};

export const LoadingComponent: React.FunctionComponent<IProps> = ({ className, style }) => (
  <Panel className={className} style={style}>
    <LoadingIndicator />
  </Panel>
);

export const MyPortfolioWidget = compose<IStateProps, TOwnProps>(
  appConnect<IStateProps, {}, TOwnProps>({
    stateToProps: s => ({
      isLoading: s.wallet.loading,
      error: s.wallet.error,
      balanceNeu: selectNeuBalance(s.wallet),
      balanceEur: selectNeuBalanceEuroAmount(s),
    }),
  }),
  branch((props: IStateProps) => props.isLoading, renderComponent(LoadingComponent)),
)(MyPortfolioWidgetComponent);
