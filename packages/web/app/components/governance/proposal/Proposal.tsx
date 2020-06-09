import { invariant, nonNullable, withContainer } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { RouteComponentProps } from "react-router-dom";
import { branch, compose, renderComponent } from "recompose";

import { IImmutableFileId } from "../../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { actions } from "../../../modules/actions";
import { selectUserId } from "../../../modules/auth/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { selectPendingDownloads } from "../../../modules/immutable-file/selectors";
import { TShareholderResolutionsVotingRoute } from "../../../modules/routing/types";
import {
  IShareholderVote,
  shareholderResolutionsVotingModuleApi,
  TProposal,
} from "../../../modules/shareholder-resolutions-voting/module";
import { appConnect } from "../../../store";
import { withMetaTags } from "../../../utils/withMetaTags.unsafe";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { EContentWidth } from "../../layouts/Content";
import { FullscreenLayout } from "../../layouts/FullscreenLayout";
import { WidgetGrid } from "../../layouts/WidgetGrid";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { ProposalDetails } from "./ProposalDetails";
import { ProposalShareholderVoteWidget } from "./ProposalShareholderVoteWidget";
import { ProposalVotingDetails } from "./ProposalVotingDetails";

import * as styles from "./Proposal.module.scss";

interface IStateProps {
  proposal: TProposal | undefined;
  shareholderVote: IShareholderVote | undefined;
  eto: TEtoWithCompanyAndContract | undefined;
  pendingDownloads: Record<string, boolean | undefined>;
}

interface IDispatchProps {
  downloadDocument: (
    immutableFileId: IImmutableFileId,
    fileName: string,
    isProtected: boolean,
  ) => void;
  closeProposalsPage: () => void;
  voteYes: () => void;
  voteNo: () => void;
}

type IProposalsProps = IStateProps & IDispatchProps;

const ProposalsLayout: React.FunctionComponent<IProposalsProps> = ({
  proposal,
  shareholderVote,
  eto,
  voteYes,
  voteNo,
  downloadDocument,
  pendingDownloads,
}) => {
  invariant(proposal, "Proposal not defined");
  invariant(eto, "Proposal ETO not defined");
  invariant(shareholderVote, "Shareholder vote not defined");

  return (
    <WidgetGrid className={styles.container}>
      <Container columnSpan={EColumnSpan.TWO_COL} type={EContainerType.CONTAINER}>
        <ProposalDetails
          proposal={proposal}
          eto={eto}
          downloadDocument={downloadDocument}
          pendingDownloads={pendingDownloads}
        />
      </Container>

      <Container
        className={styles.voteDetailsContainer}
        columnSpan={EColumnSpan.ONE_COL}
        type={EContainerType.GRID}
      >
        <ProposalShareholderVoteWidget
          proposal={proposal}
          shareholderVote={shareholderVote}
          voteYes={voteYes}
          voteNo={voteNo}
          eto={eto}
        />

        <ProposalVotingDetails proposal={proposal} />
      </Container>
    </WidgetGrid>
  );
};

export const Proposal = compose<
  IStateProps & IDispatchProps,
  RouteComponentProps<TShareholderResolutionsVotingRoute>
>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, IDispatchProps, RouteComponentProps<TShareholderResolutionsVotingRoute>>({
    stateToProps: (state, props) => {
      const { proposalId } = props.match.params;

      const shareholderAddress = nonNullable(selectUserId(state));

      const proposal = shareholderResolutionsVotingModuleApi.selectors.selectProposalById(
        proposalId,
      )(state);
      return {
        proposal,
        shareholderVote: shareholderResolutionsVotingModuleApi.selectors.selectShareholderProposalVote(
          shareholderAddress,
          proposalId,
        )(state),
        eto: shareholderResolutionsVotingModuleApi.selectors.selectProposalEto(proposalId)(state),
        pendingDownloads: selectPendingDownloads(state),
      };
    },
    dispatchToProps: (dispatch, props) => {
      const { proposalId } = props.match.params;

      return {
        closeProposalsPage: () => dispatch(actions.routing.goToDashboard()),
        downloadDocument: (
          immutableFileId: IImmutableFileId,
          fileName: string,
          isProtected: boolean,
        ) => {
          dispatch(
            actions.immutableStorage.downloadImmutableFile(immutableFileId, fileName, isProtected),
          );
        },
        voteYes: () =>
          dispatch(actions.txTransactions.startShareholderResolutionVote(proposalId, true)),
        voteNo: () =>
          dispatch(actions.txTransactions.startShareholderResolutionVote(proposalId, false)),
      };
    },
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
  branch<IStateProps>(
    props => !props.proposal || !props.shareholderVote || !props.eto,
    renderComponent(LoadingIndicator),
  ),
  withMetaTags<IStateProps>(({ proposal }, intl) => ({
    title: intl.formatIntlMessage("governance.proposal.title", { proposalTitle: proposal?.title }),
  })),
)(ProposalsLayout);
