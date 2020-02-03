import { branch, compose, renderComponent, renderNothing } from "recompose";

import { actions } from "../../../../modules/actions";
import {
  selectIsIncomingPayoutPending,
  selectPayoutAvailable,
  selectTokensDisbursalEurEquivTotal,
} from "../../../../modules/investor-portfolio/selectors";
import { appConnect } from "../../../../store";
import { MyNeuWidgetAvailablePayout } from "./MyNeuWidgetAvailalblePayout";
import { MyNeuWidgetPendingPayout } from "./MyNeuWidgetPendingPayout";

type TStateProps = {
  tokensDisbursalEurEquiv: string | undefined;
  availablePayout: boolean;
  pendingPayout: boolean;
};

type TDispatchProps = {
  goToPortfolio: () => void;
};

type TPayoutProps = TStateProps & TDispatchProps;

const MyNeuWidgetPayout = compose<TPayoutProps, {}>(
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      pendingPayout: selectIsIncomingPayoutPending(state),
      availablePayout: selectPayoutAvailable(state),
      tokensDisbursalEurEquiv: selectTokensDisbursalEurEquivTotal(state),
    }),
    dispatchToProps: dispatch => ({
      goToPortfolio: () => dispatch(actions.routing.goToPortfolio()),
    }),
  }),
  branch<TStateProps>(state => !state.pendingPayout && !state.availablePayout, renderNothing),
  branch<TStateProps>(
    state => !state.pendingPayout && state.availablePayout,
    renderComponent(MyNeuWidgetAvailablePayout),
  ),
)(MyNeuWidgetPendingPayout);

export { MyNeuWidgetPayout, TPayoutProps };
