import { withContainer } from "@neufund/shared";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { selectIsVerifiedInvestor } from "../../modules/auth/selectors";
import {
  selectMyAssets,
  selectMyPendingAssets,
  selectPastInvestments,
  selectTokensDisbursal,
} from "../../modules/investor-portfolio/selectors";
import { selectEthereumAddressWithChecksum } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/react-connected-components/OnEnterAction";
import { withMetaTags } from "../../utils/withMetaTags.unsafe";
import { Layout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../shared/loading-indicator";
import { IPortfolioDispatchProps, PortfolioLayout, TPortfolioLayoutProps } from "./PortfolioLayout";

export type TStateProps = Partial<TPortfolioLayoutProps>;

export const Portfolio = compose<TPortfolioLayoutProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.eto.loadEtos());

      if (process.env.NF_ASSETS_PORTFOLIO_COMPONENT_VISIBLE === "1") {
        dispatch(actions.investorEtoTicket.loadClaimables());
      }
    },
  }),
  appConnect<TStateProps, IPortfolioDispatchProps>({
    stateToProps: state => ({
      myAssets: selectMyAssets(state),
      pendingAssets: selectMyPendingAssets(state),
      walletAddress: selectEthereumAddressWithChecksum(state),
      tokensDisbursal: selectTokensDisbursal(state),
      isVerifiedInvestor: selectIsVerifiedInvestor(state),
      pastInvestments: selectPastInvestments(state),
    }),
  }),
  withContainer(Layout),
  branch(
    (props: TStateProps) => !props.myAssets && !props.pendingAssets,
    renderComponent(LoadingIndicator),
  ),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.portfolio") })),
)(PortfolioLayout);
