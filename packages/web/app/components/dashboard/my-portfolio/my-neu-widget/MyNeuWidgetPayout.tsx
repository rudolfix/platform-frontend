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
  isPayoutAvailable: boolean;
  isPayoutPending: boolean;
};

type TDispatchProps = {
  goToPortfolio: () => void;
};

type TPayoutProps = TStateProps & TDispatchProps;

const MyNeuWidgetPayout = compose<TPayoutProps, {}>(
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      isPayoutPending: selectIsIncomingPayoutPending(state),
      isPayoutAvailable: selectPayoutAvailable(state),
      tokensDisbursalEurEquiv: selectTokensDisbursalEurEquivTotal(state),
    }),
    dispatchToProps: dispatch => ({
      goToPortfolio: () => dispatch(actions.routing.goToPortfolio()),
    }),
  }),
  branch<TStateProps>(
    state => state.isPayoutAvailable,
    renderComponent(MyNeuWidgetAvailablePayout),
  ),
  branch<TStateProps>(state => !state.isPayoutPending && !state.isPayoutAvailable, renderNothing),
)(MyNeuWidgetPendingPayout);

export { MyNeuWidgetPayout, TPayoutProps };
