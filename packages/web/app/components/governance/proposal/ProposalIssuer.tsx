import { invariant } from "@neufund/shared-utils";
import * as React from "react";
import { compose } from "recompose";

import { IImmutableFileId } from "../../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { actions } from "../../../modules/actions";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { selectPendingDownloads } from "../../../modules/immutable-file/selectors";
import { shareholderResolutionsVotingViewModuleApi } from "../../../modules/shareholder-resolutions-voting-view/module";
import { TProposal } from "../../../modules/shareholder-resolutions-voting/module";
import { appConnect } from "../../../store";
import { withMetaTags } from "../../../utils/withMetaTags.unsafe";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { WidgetGrid } from "../../layouts/WidgetGrid";
import { ProposalDetails } from "./ProposalDetails";
import { ProposalVotingBreakdown } from "./voting-details/ProposalVotingBreakdown";

import * as styles from "./ProposalShared.module.scss";

type TExternalProps = {};

interface IStateProps {
  proposal: TProposal | undefined;
  eto: TEtoWithCompanyAndContract | undefined;
  pendingDownloads: Record<string, boolean | undefined>;
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
  eto,
  downloadDocument,
  pendingDownloads,
}) => {
  invariant(proposal, "Proposal not defined");
  invariant(eto, "Proposal ETO not defined");

  return (
    <WidgetGrid className={styles.container}>
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
        <ProposalVotingBreakdown proposal={proposal} eto={eto} />
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