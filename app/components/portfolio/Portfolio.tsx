import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import {
  selectMyAssets,
  selectMyPendingAssets,
  selectTokensDisbursal,
} from "../../modules/investor-portfolio/selectors";
import { selectEthereumAddressWithChecksum } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { withMetaTags } from "../../utils/withMetaTags";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { PortfolioLayout, TPortfolioLayoutProps } from "./PortfolioLayout";

export type TStateProps = Partial<TPortfolioLayoutProps>;

export const Portfolio = compose<TPortfolioLayoutProps, {}>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.publicEtos.loadEtos());

      if (process.env.NF_ASSETS_PORTFOLIO_COMPONENT_VISIBLE === "1") {
        dispatch(actions.investorEtoTicket.loadClaimables());
      }
    },
  }),
  appConnect<TStateProps, {}>({
    stateToProps: state => ({
      myAssets: selectMyAssets(state),
      pendingAssets: selectMyPendingAssets(state),
      walletAddress: selectEthereumAddressWithChecksum(state),
      tokensDisbursal: selectTokensDisbursal(state),
    }),
  }),
  withContainer(LayoutAuthorized),
  branch(
    (props: TStateProps) => !props.myAssets && !props.pendingAssets,
    renderComponent(LoadingIndicator),
  ),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.portfolio") })),
)(PortfolioLayout);
