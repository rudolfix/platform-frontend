import { withContainer } from "@neufund/shared";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { externalRoutes } from "../../../../config/externalRoutes";
import { actions } from "../../../../modules/actions";
import {
  selectIsIncomingPayoutLoading,
  selectIsIncomingPayoutNotInitialized,
  selectIsIncomingPayoutPending,
  selectPayoutAvailable,
  selectTokensDisbursalIsLoading,
  selectTokensDisbursalNotInitialized,
} from "../../../../modules/investor-portfolio/selectors";
import { ITokenDisbursal } from "../../../../modules/investor-portfolio/types";
import {
  selectIsLoading,
  selectNeuBalance,
  selectNeuBalanceEuroAmount,
  selectWalletError,
} from "../../../../modules/wallet/selectors";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/react-connected-components/OnEnterAction";
import { EButtonLayout, EButtonSize } from "../../../shared/buttons/Button";
import { ButtonLink } from "../../../shared/buttons/ButtonLink";
import { ECurrency } from "../../../shared/formatters/utils";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { MoneySuiteWidget } from "../../../shared/MoneySuiteWidget/MoneySuiteWidget";
import { ETheme } from "../../../shared/TransactionData";
import { MyNeuWidgetError } from "./MyNeuWidgetError";
import { MyNeuWidgetPayout } from "./MyNeuWidgetPayout";

import icon from "../../../../assets/img/neu_icon.svg";
import * as styles from "./MyNeuWidget.module.scss";

type TErrorStateProps = {
  isLoading: boolean;
  error: string | undefined;
};

type TComponentStateProps = {
  balanceNeu: string;
  balanceEur: string;
  availablePayout: boolean;
  pendingPayout: boolean;
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
        transactionTheme={ETheme.SILVER_LIGHT}
      />
      <MyNeuWidgetPayout />
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
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.investorEtoTicket.getIncomingPayouts());
      dispatch(actions.investorEtoTicket.loadClaimables());
    },
  }),
  appConnect<TStateProps>({
    stateToProps: state => ({
      isLoading:
        selectIsLoading(state) ||
        selectIsIncomingPayoutNotInitialized(state) ||
        selectTokensDisbursalNotInitialized(state) ||
        selectIsIncomingPayoutLoading(state) ||
        selectTokensDisbursalIsLoading(state),
      error: selectWalletError(state),
      balanceNeu: selectNeuBalance(state),
      balanceEur: selectNeuBalanceEuroAmount(state),
      pendingPayout: selectIsIncomingPayoutPending(state),
      availablePayout: selectPayoutAvailable(state),
    }),
  }),
  withContainer(MyNeuWidgetLayoutWrapper),
  branch<TStateProps>(({ error }) => !!error, renderComponent(MyNeuWidgetError)),
  branch<TStateProps>(({ isLoading }) => isLoading, renderComponent(LoadingIndicator)),
)(MyNeuWidgetLayout);
