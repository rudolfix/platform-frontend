import { TEtoWithCompanyAndContract } from "@neufund/shared-modules";
import { invariant } from "@neufund/shared-utils";
import * as React from "react";
import { compose } from "recompose";

import { IImmutableFileId } from "../../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { actions } from "../../../modules/actions";
import { selectPendingDownloads } from "../../../modules/immutable-file/selectors";
import { shareholderResolutionsVotingViewModuleApi } from "../../../modules/shareholder-resolutions-voting-view/module";
import { TProposal } from "../../../modules/shareholder-resolutions-voting/module";
import {
  IShareCapitalBreakdown,
  ITokenHolderBreakdown,
} from "../../../modules/shareholder-resolutions-voting/types";
import { appConnect } from "../../../store";
import { withMetaTags } from "../../../utils/withMetaTags";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { WidgetGrid } from "../../layouts/WidgetGrid";
import { ProposalDetails } from "./ProposalDetails";
import { ProposalVotingDetails } from "./voting-details/ProposalVotingDetails";

import * as styles from "./ProposalShared.module.scss";

type TExternalProps = {};

interface IStateProps {
  proposal: TProposal | undefined;
  eto: TEtoWithCompanyAndContract | undefined;
  pendingDownloads: Record<string, boolean | undefined>;
  nomineeShareBreakdown: ITokenHolderBreakdown | undefined;
  shareCapitalBreakdown: IShareCapitalBreakdown | undefined;
}

interface IDispatchProps {
  downloadDocument: (
    immutableFileId: IImmutableFileId,
    fileName: string,
    isProtected: boolean,
  ) => void;
}

type IProposalsProps = IStateProps & IDispatchProps;

const ProposalIssuerLayout: React.FunctionComponent<IProposalsProps> = ({
  proposal,
  nomineeShareBreakdown,
  shareCapitalBreakdown,
  eto,
  downloadDocument,
  pendingDownloads,
}) => {
  invariant(proposal, "Proposal not defined");
  invariant(eto, "Proposal ETO not defined");

  return (
    <WidgetGrid className={styles.container} data-test-id="governance.issuer-proposal">
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
        <ProposalVotingDetails
          proposal={proposal}
          nomineeShareBreakdown={nomineeShareBreakdown}
          shareCapitalBreakdown={shareCapitalBreakdown}
          downloadDocument={downloadDocument}
          pendingDownloads={pendingDownloads}
          eto={eto}
        />
      </Container>
    </WidgetGrid>
  );
};

export const ProposalIssuer = compose<IStateProps & IDispatchProps, TExternalProps>(
  appConnect<IStateProps, IDispatchProps, TExternalProps>({
    stateToProps: state => ({
      proposal: shareholderResolutionsVotingViewModuleApi.selectors.selectProposal(state),
      eto: shareholderResolutionsVotingViewModuleApi.selectors.selectProposalEto(state),
      pendingDownloads: selectPendingDownloads(state),
      nomineeShareBreakdown: shareholderResolutionsVotingViewModuleApi.selectors.selectNomineeBreakdownStats(
        state,
      ),
      shareCapitalBreakdown: shareholderResolutionsVotingViewModuleApi.selectors.selectShareCapitalBreakdownStats(
        state,
      ),
    }),
    dispatchToProps: dispatch => ({
      downloadDocument: (
        immutableFileId: IImmutableFileId,
        fileName: string,
        isProtected: boolean,
      ) => {
        dispatch(
          actions.immutableStorage.downloadImmutableFile(immutableFileId, fileName, isProtected),
        );
      },
    }),
  }),
  withMetaTags<IStateProps>(({ proposal }, intl) => ({
    title: intl.formatIntlMessage("governance.proposal.title", { proposalTitle: proposal?.title }),
  })),
)(ProposalIssuerLayout);
