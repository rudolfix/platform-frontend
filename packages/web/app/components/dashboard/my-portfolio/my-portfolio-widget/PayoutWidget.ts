import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import {
  selectIncomingPayoutError,
  selectIncomingPayoutSnapshotDate,
  selectIsIncomingPayoutLoading,
  selectIsIncomingPayoutNotInitialized,
  selectIsIncomingPayoutPending,
  selectPayoutAvailable,
  selectTokensDisbursalError,
  selectTokensDisbursalIsLoading,
  selectTokensDisbursalNotInitialized,
} from "../../../../modules/investor-portfolio/selectors";
import { snapshotIsActual } from "../../../../modules/investor-portfolio/utils";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { PayoutWidgetError } from "./PayoutWidgetError";
import { WelcomeToNeufund } from "./WelcomeToNeufund";

interface IStateProps {
  isLoading: boolean;
  error: boolean;
  pendingPayout: boolean;
  availablePayout: boolean;
  snapshotIsActual: boolean;
}

export const PayoutWidget = compose<{}, {}>(
  onEnterAction({
    actionCreator: d => {
      d(actions.investorEtoTicket.getIncomingPayouts());
      d(actions.investorEtoTicket.loadClaimables());
    },
  }),
  appConnect<IStateProps>({
    stateToProps: s => {
      const snapshotDate = selectIncomingPayoutSnapshotDate(s);

      return {
        isLoading:
          selectIsIncomingPayoutNotInitialized(s) ||
          selectTokensDisbursalNotInitialized(s) ||
          selectIsIncomingPayoutLoading(s) ||
          selectTokensDisbursalIsLoading(s),
        error: selectIncomingPayoutError(s) || selectTokensDisbursalError(s),
        pendingPayout: selectIsIncomingPayoutPending(s),
        availablePayout: selectPayoutAvailable(s),
        snapshotIsActual: !!snapshotDate && snapshotIsActual(snapshotDate, new Date()),
      };
    },
  }),
  branch((props: IStateProps) => props.error, renderComponent(PayoutWidgetError)),
  branch((props: IStateProps) => props.isLoading, renderComponent(LoadingIndicator)),
  // Temporary Removed the logic here
)(WelcomeToNeufund);
