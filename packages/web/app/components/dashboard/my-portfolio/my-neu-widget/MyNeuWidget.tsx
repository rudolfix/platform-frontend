import { withContainer } from "@neufund/shared";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { externalRoutes } from "../../../../config/externalRoutes";
import { actions } from "../../../../modules/actions";
import {
  selectIsIncomingPayoutPending,
  selectPayoutAvailable,
  selectTokensDisbursal,
  selectTokensDisbursalEurEquivTotal,
} from "../../../../modules/investor-portfolio/selectors";
import { ITokenDisbursal } from "../../../../modules/investor-portfolio/types";
import {
  selectIsLoading,
  selectNeuBalance,
  selectNeuBalanceEuroAmount,
  selectWalletError,
} from "../../../../modules/wallet/selectors";
import { appConnect } from "../../../../store";
import { EButtonLayout, EButtonSize } from "../../../shared/buttons/Button";
import { ButtonLink } from "../../../shared/buttons/ButtonLink";
import { ECurrency } from "../../../shared/formatters/utils";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { ESize, MoneySuiteWidget } from "../../../shared/MoneySuiteWidget/MoneySuiteWidget";
import { MyNeuWidgetAvailablePayout } from "./MyNeuWidgetAvailalblePayout";
import { MyNeuWidgetError } from "./MyNeuWidgetError";
import { MyNeuWidgetPendingPayout } from "./MyNeuWidgetPendingPayout";

import icon from "../../../../assets/img/neu_icon.svg";
import styles from "./MyNeuWidget.module.scss";

type TErrorStateProps = {
  isLoading: boolean;
  error: string | undefined;
};

type TComponentStateProps = {
  balanceNeu: string;
  balanceEur: string;
  tokensDisbursalEurEquiv: string | undefined;
  availablePayout: boolean;
  pendingPayout: boolean;
  tokensDisbursal: ReadonlyArray<ITokenDisbursal> | undefined;
};

type TStateProps = TErrorStateProps & TComponentStateProps;

export type TDispatchProps = {
  acceptCombinedPayout: (tokensDisbursal: ReadonlyArray<ITokenDisbursal>) => void;
};

type TComponentProps = TComponentStateProps & TDispatchProps;

export const MyNeuWidgetLayoutWrapper: React.FunctionComponent = ({ children }) => (
  <section className={styles.wrapper}>
    <h4 className={styles.title}>
      <FormattedMessage id="dashboard.my-neu-widget.my-neumark" />
    </h4>
    {children}
  </section>
);

export const MyNeuWidgetLayout: React.FunctionComponent<TComponentProps> = props => (
  <>
    <div className={styles.content}>
      <MoneySuiteWidget
        currency={ECurrency.NEU}
        largeNumber={props.balanceNeu}
        icon={icon}
        value={props.balanceEur}
        currencyTotal={ECurrency.EUR}
        data-test-id="my-neu-widget-neumark-balance"
        size={ESize.LARGE}
      />
      {props.availablePayout && props.tokensDisbursalEurEquiv && (
        <MyNeuWidgetAvailablePayout
          acceptCombinedPayout={props.acceptCombinedPayout}
          tokensDisbursal={props.tokensDisbursal}
          tokensDisbursalEurEquiv={props.tokensDisbursalEurEquiv}
        />
      )}
      {!props.availablePayout && props.pendingPayout && <MyNeuWidgetPendingPayout />}
      {!props.availablePayout && !props.pendingPayout && (
        <ButtonLink
          to={externalRoutes.neufundSupportWhatIsNeu}
          target="_blank"
          layout={EButtonLayout.OUTLINE}
          data-test-id="my-neu-widget-support-link"
          size={EButtonSize.SMALL}
          className={styles.button}
        >
          <FormattedMessage id="dashboard.my-neu-widget.about" />
        </ButtonLink>
      )}
    </div>
  </>
);

export const MyNeuWidget = compose<TComponentProps, {}>(
  appConnect<TStateProps>({
    stateToProps: state => ({
      isLoading: selectIsLoading(state),
      error: selectWalletError(state),
      balanceNeu: selectNeuBalance(state),
      balanceEur: selectNeuBalanceEuroAmount(state),
      pendingPayout: selectIsIncomingPayoutPending(state),
      availablePayout: selectPayoutAvailable(state),
      tokensDisbursal: selectTokensDisbursal(state),
      tokensDisbursalEurEquiv: selectTokensDisbursalEurEquivTotal(state),
    }),
    dispatchToProps: dispatch => ({
      acceptCombinedPayout: (tokensDisbursal: ReadonlyArray<ITokenDisbursal>) =>
        dispatch(actions.txTransactions.startInvestorPayoutAccept(tokensDisbursal)),
    }),
  }),
  withContainer(MyNeuWidgetLayoutWrapper),
  branch<TStateProps>(({ error }) => !!error, renderComponent(MyNeuWidgetError)),
  branch<TStateProps>(
    ({ isLoading, tokensDisbursalEurEquiv }) => isLoading || tokensDisbursalEurEquiv === undefined,
    renderComponent(LoadingIndicator),
  ),
)(MyNeuWidgetLayout);
