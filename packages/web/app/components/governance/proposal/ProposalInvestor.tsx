import { invariant } from "@neufund/shared-utils";
import * as React from "react";
import { compose } from "recompose";

import { IImmutableFileId } from "../../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { actions } from "../../../modules/actions";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { selectPendingDownloads } from "../../../modules/immutable-file/selectors";
import { shareholderResolutionsVotingViewModuleApi } from "../../../modules/shareholder-resolutions-voting-view/module";
import {
  IShareholderVote,
  TProposal,
} from "../../../modules/shareholder-resolutions-voting/module";
import { appConnect } from "../../../store";
import { withMetaTags } from "../../../utils/withMetaTags.unsafe";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { WidgetGrid } from "../../layouts/WidgetGrid";
import { ProposalDetails } from "./ProposalDetails";
import { ProposalShareholderVoteWidget } from "./ProposalShareholderVoteWidget";
import { ProposalVotingDetails } from "./voting-details/ProposalVotingDetails";

import * as styles from "./ProposalShared.module.scss";

type TExternalProps = {
  proposalId: string | undefined;
};

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
  voteYes: () => void;
  voteNo: () => void;
}

type IProposalsProps = IStateProps & IDispatchProps;

const ProposalInvestorLayout: React.FunctionComponent<IProposalsProps> = ({
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
    <WidgetGrid className={styles.container} data-test-id="governance.investor-proposal">
      <Container columnSpan={EColumnSpan.TWO_COL} type={EContainerType.CONTAINER}>
        <ProposalDetails
          proposal={proposal}
          eto={eto}
          company={eto.company}
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

export const ProposalInvestor = compose<IStateProps & IDispatchProps, TExternalProps>(
  appConnect<IStateProps, IDispatchProps, TExternalProps>({
    stateToProps: state => ({
      proposal: shareholderResolutionsVotingViewModuleApi.selectors.selectProposal(state),
      shareholderVote: shareholderResolutionsVotingViewModuleApi.selectors.selectProposalShareholder(
        state,
      ),
      eto: shareholderResolutionsVotingViewModuleApi.selectors.selectProposalEto(state),
      pendingDownloads: selectPendingDownloads(state),
    }),
    dispatchToProps: (dispatch, { proposalId }) => {
      invariant(proposalId, "Proposal id should be defined");

      return {
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
  withMetaTags<IStateProps>(({ proposal }, intl) => ({
    title: intl.formatIntlMessage("governance.proposal.title", { proposalTitle: proposal?.title }),
  })),
)(ProposalInvestorLayout);
