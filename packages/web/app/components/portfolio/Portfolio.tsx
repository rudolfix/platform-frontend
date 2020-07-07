import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { selectIsVerifiedInvestor } from "../../modules/auth/selectors";
import { selectEtosError } from "../../modules/eto/selectors";
import {
  selectMyAssets,
  selectMyPendingAssets,
  selectPastInvestments,
  selectTokensDisbursal,
  selectTokensDisbursalError,
  selectTokensDisbursalEurEquivTotal,
  selectTokensDisbursalEurEquivTotalDisbursed,
  selectTokensDisbursalIsLoading,
} from "../../modules/investor-portfolio/selectors";
import { selectEthereumAddress } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/react-connected-components/OnEnterAction";
import { withMetaTags } from "../../utils/withMetaTags";
import { Layout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../shared/hocs/withContainer";
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
      walletAddress: selectEthereumAddress(state),
      tokensDisbursal: selectTokensDisbursal(state),
      tokenDisbursalIsLoading: selectTokensDisbursalIsLoading(state),
      tokenDisbursalError: selectTokensDisbursalError(state),
      tokensDisbursalEurEquivTotal: selectTokensDisbursalEurEquivTotal(state),
      tokensDisbursalEurEquivTotalDisbursed: selectTokensDisbursalEurEquivTotalDisbursed(state),
      isVerifiedInvestor: selectIsVerifiedInvestor(state),
      pastInvestments: selectPastInvestments(state),
      etosError: selectEtosError(state),
    }),
  }),
  withContainer(Layout),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.portfolio") })),
)(PortfolioLayout);
