import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { selectMyAssets, selectMyPendingAssets } from "../../modules/investor-tickets/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { PortfolioLayout } from "./PortfolioLayout";

export const Portfolio = compose(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.investorEtoTicket.loadEtosWithInvestorTickets()),
  }),
  appConnect({
    stateToProps: state => ({
      test: true,
      myAssets: selectMyAssets(state),
      pendingAssets: selectMyPendingAssets(state),
    }),
  }),
  withContainer(LayoutAuthorized),
  branch(props => !props.myAssets && !props.pendingAssets, renderComponent(LoadingIndicator)),
)(PortfolioLayout);
