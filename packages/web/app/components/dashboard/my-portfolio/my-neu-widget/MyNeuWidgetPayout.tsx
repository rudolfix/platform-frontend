import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, renderNothing } from "recompose";

import { actions } from "../../../../modules/actions";
import {
  selectIncomingPayoutError,
  selectIsIncomingPayoutPending,
  selectPayoutAvailable,
  selectTokensDisbursalError,
  selectTokensDisbursalEurEquivTotal,
} from "../../../../modules/investor-portfolio/selectors";
import { appConnect } from "../../../../store";
import { WarningAlert } from "../../../shared/WarningAlert";
import { MyNeuWidgetAvailablePayout } from "./MyNeuWidgetAvailalblePayout";
import { MyNeuWidgetPendingPayout } from "./MyNeuWidgetPendingPayout";

type TStateProps = {
  tokensDisbursalEurEquiv: string | undefined;
  availablePayout: boolean;
  pendingPayout: boolean;
  error: boolean;
};

type TDispatchProps = {
  goToPortfolio: () => void;
};

const MyNeuWidgetError: React.FunctionComponent = () => (
  <WarningAlert data-test-id="my-neu-widget-payout-error" className="m-auto">
    <FormattedMessage id="common.error" values={{ separator: <br /> }} />
  </WarningAlert>
);

const MyNeuWidgetPayout = compose<TStateProps & TDispatchProps, {}>(
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      pendingPayout: selectIsIncomingPayoutPending(state),
      availablePayout: selectPayoutAvailable(state),
      tokensDisbursalEurEquiv: selectTokensDisbursalEurEquivTotal(state),
      error: selectIncomingPayoutError(state) || selectTokensDisbursalError(state),
    }),
    dispatchToProps: dispatch => ({
      goToPortfolio: () => dispatch(actions.routing.goToPortfolio()),
    }),
  }),
  branch<TStateProps>(state => state.error, renderComponent(MyNeuWidgetError)),
  branch<TStateProps>(state => !state.availablePayout && !state.pendingPayout, renderNothing),
  branch<TStateProps>(state => state.availablePayout, renderComponent(MyNeuWidgetAvailablePayout)),
  branch<TStateProps>(state => state.pendingPayout, renderComponent(MyNeuWidgetPendingPayout)),
)(MyNeuWidgetAvailablePayout);

export { MyNeuWidgetPayout };
