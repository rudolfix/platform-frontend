import { investorPortfolioModuleApi, ITokenDisbursal } from "@neufund/shared-modules";
import * as moment from "moment";
import { branch, compose, renderComponent, withProps } from "recompose";

import { PAYOUT_POLLING_DELAY } from "../../../../config/constants";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/react-connected-components/OnEnterAction";
import { withActionWatcher } from "../../../../utils/react-connected-components/withActionWatcher.unsafe";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { IncomingPayoutAvailable } from "./IncomingPayoutAvailable";
import { IncomingPayoutPendingLayout } from "./IncomingPayoutPending";
import { IncomingPayoutWaitingLayout } from "./IncomingPayoutWaiting";
import { PayoutWidgetError } from "./PayoutWidgetError";
import { WelcomeToNeufund } from "./WelcomeToNeufund";

type TStateProps = {
  isLoading: boolean;
  error: boolean;
  pendingPayout: boolean;
  availablePayout: boolean;
  snapshotIsActual: boolean;
  etherTokenIncomingPayout: string;
  euroTokenIncomingPayout: string;
  tokensDisbursal: readonly ITokenDisbursal[] | undefined;
};

type TDispatchProps = {
  loadPayoutsData: () => void;
};

type TEndDate = {
  endDate: Date;
};

export const IncomingPayoutPending = compose<
  TStateProps & TEndDate & TDispatchProps,
  TStateProps & TDispatchProps
>(
  withProps<TEndDate, TStateProps>({
    endDate: moment()
      .utc()
      .add(1, "day")
      .startOf("day")
      .toDate(),
  }),
)(IncomingPayoutPendingLayout);

export const IncomingPayoutWaiting = compose<
  TStateProps & TDispatchProps,
  TStateProps & TDispatchProps
>(
  // TODO: Move watcher to saga
  withActionWatcher({
    actionCreator: d => {
      d(actions.investorEtoTicket.getIncomingPayoutsInBackground());
      d(actions.investorEtoTicket.loadClaimablesInBackground());
    },
    interval: PAYOUT_POLLING_DELAY,
  }),
)(IncomingPayoutWaitingLayout);

export const PayoutWidget = compose<TStateProps & TDispatchProps, {}>(
  onEnterAction({
    actionCreator: d => {
      d(actions.investorEtoTicket.getIncomingPayouts());
      d(actions.investorEtoTicket.loadClaimables());
    },
  }),
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: s => {
      const snapshotDate = investorPortfolioModuleApi.selectors.selectIncomingPayoutSnapshotDate(s);

      return {
        isLoading:
          investorPortfolioModuleApi.selectors.selectIsIncomingPayoutNotInitialized(s) ||
          investorPortfolioModuleApi.selectors.selectTokensDisbursalNotInitialized(s) ||
          investorPortfolioModuleApi.selectors.selectIsIncomingPayoutLoading(s) ||
          investorPortfolioModuleApi.selectors.selectTokensDisbursalIsLoading(s),
        error:
          investorPortfolioModuleApi.selectors.selectIncomingPayoutError(s) ||
          investorPortfolioModuleApi.selectors.selectTokensDisbursalError(s),
        pendingPayout: investorPortfolioModuleApi.selectors.selectIsIncomingPayoutPending(s),
        availablePayout: investorPortfolioModuleApi.selectors.selectPayoutAvailable(s),
        snapshotIsActual:
          !!snapshotDate &&
          investorPortfolioModuleApi.utils.snapshotIsActual(snapshotDate, new Date()),
        etherTokenIncomingPayout: investorPortfolioModuleApi.selectors.selectEtherTokenIncomingPayout(
          s,
        ),
        euroTokenIncomingPayout: investorPortfolioModuleApi.selectors.selectEuroTokenIncomingPayout(
          s,
        ),
        tokensDisbursal: investorPortfolioModuleApi.selectors.selectTokensDisbursal(s),
      };
    },
    dispatchToProps: d => ({
      loadPayoutsData: () => {
        d(actions.investorEtoTicket.getIncomingPayouts());
        d(actions.investorEtoTicket.loadClaimables());
      },
    }),
  }),
  branch((props: TStateProps) => props.error, renderComponent(PayoutWidgetError)),
  branch((props: TStateProps) => props.isLoading, renderComponent(LoadingIndicator)),
  branch(
    (props: TStateProps) => !props.pendingPayout && !props.availablePayout,
    renderComponent(WelcomeToNeufund),
  ),
  branch(
    (props: TStateProps) => !props.pendingPayout && props.availablePayout,
    renderComponent<TStateProps & TDispatchProps>(IncomingPayoutAvailable),
  ),
  branch(
    (props: TStateProps) => props.pendingPayout && !props.snapshotIsActual,
    renderComponent<TStateProps & TDispatchProps>(IncomingPayoutWaiting),
  ) /* for the case the user's clock is ahead of the node's clock */,
)(IncomingPayoutPending);
