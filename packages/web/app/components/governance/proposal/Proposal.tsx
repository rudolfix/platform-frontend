import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { RouteComponentProps } from "react-router-dom";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../modules/actions";
import { TShareholderResolutionsVotingRoute } from "../../../modules/routing/types";
import {
  EShareholderResolutionProposalViewType,
  shareholderResolutionsVotingViewModuleApi,
} from "../../../modules/shareholder-resolutions-voting-view/module";
import { appConnect } from "../../../store";
import { EProcessState } from "../../../utils/enums/processStates";
import { EContentWidth } from "../../layouts/Content";
import { FullscreenLayout } from "../../layouts/FullscreenLayout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../../shared/hocs/withContainer";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { shouldNeverHappen } from "../../shared/NeverComponent";
import { ProposalInvestor } from "./ProposalInvestor";
import { ProposalIssuer } from "./ProposalIssuer";

type TStateProps = ReturnType<
  typeof shareholderResolutionsVotingViewModuleApi.selectors.selectProposalViewState
>;

interface IDispatchProps {
  closeProposalsPage: () => void;
}

export const Proposal = compose<
  TStateProps & IDispatchProps,
  RouteComponentProps<TShareholderResolutionsVotingRoute>
>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TStateProps, IDispatchProps, RouteComponentProps<TShareholderResolutionsVotingRoute>>({
    stateToProps: state =>
      shareholderResolutionsVotingViewModuleApi.selectors.selectProposalViewState(state),
    dispatchToProps: dispatch => ({
      closeProposalsPage: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  withContainer<IDispatchProps>(({ closeProposalsPage, ...props }) => (
    <FullscreenLayout
      width={EContentWidth.CONSTRAINED}
      buttonProps={{
        buttonText: <FormattedMessage id="common.close" />,
        buttonAction: closeProposalsPage,
      }}
      {...props}
    />
  )),
  branch<TStateProps>(
    ({ processState }) =>
      [EProcessState.NOT_STARTED, EProcessState.IN_PROGRESS].includes(processState),
    renderComponent(LoadingIndicator),
  ),
  branch<TStateProps>(
    ({ processState }) => processState === EProcessState.ERROR,
    renderComponent(ErrorBoundaryLayout),
  ),
  branch<TStateProps>(
    ({ viewType }) => viewType === EShareholderResolutionProposalViewType.VIEW_INVESTOR,
    renderComponent<TStateProps>(({ proposalId }) => <ProposalInvestor proposalId={proposalId} />),
  ),
  branch<TStateProps>(
    ({ viewType }) => viewType === EShareholderResolutionProposalViewType.VIEW_ISSUER,
    renderComponent(ProposalIssuer),
  ),
)(shouldNeverHappen("Proposal branched to default branch"));
