import { TEtoWithCompanyAndContract } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { IImmutableFileId } from "../../../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { shareholderResolutionsVotingModuleApi } from "../../../../modules/shareholder-resolutions-voting/module";
import {
  EProposalState,
  IShareCapitalBreakdown,
  ITokenHolderBreakdown,
  TProposal,
} from "../../../../modules/shareholder-resolutions-voting/types";
import { EPanelPadding, PanelRounded } from "../../../shared/Panel";
import { CapitalShareBreakdown } from "./CapitalShareBreakdown";
import { ProposalVotingBasicDetails } from "./PoposalVotingBasicDetails";
import { TokenHolderNomineeBreakdown } from "./TokenHolderNomineeBreakdown";
import { EVotingStateLayout, VotingStateWidget } from "./VotingStateWidget";

type TExternalProps = {
  proposal: TProposal;
  nomineeShareBreakdown: ITokenHolderBreakdown | undefined;
  shareCapitalBreakdown: IShareCapitalBreakdown | undefined;
  downloadDocument: (immutableFileId: IImmutableFileId, fileName: string) => void;
  pendingDownloads: Record<string, boolean | undefined>;
  eto: TEtoWithCompanyAndContract | undefined;
};

const ProposalVotingDetails: React.FunctionComponent<TExternalProps> = ({
  proposal,
  nomineeShareBreakdown,
  shareCapitalBreakdown,
  downloadDocument,
  pendingDownloads,
  eto,
}) => {
  const participationPercentage = shareholderResolutionsVotingModuleApi.utils.calculateParticipationPercentage(
    proposal,
  );
  return (
    <PanelRounded padding={EPanelPadding.NORMAL}>
      <ProposalVotingBasicDetails
        proposal={proposal}
        participationPercentage={participationPercentage}
      />
      {proposal.state === EProposalState.Tally && (
        <section>
          {nomineeShareBreakdown && (
            <TokenHolderNomineeBreakdown nomineeShareBreakdown={nomineeShareBreakdown} />
          )}
          <VotingStateWidget layout={EVotingStateLayout.WAITING}>
            <FormattedMessage id="governance.proposal.voting.details.waiting.for.votes" />
          </VotingStateWidget>
        </section>
      )}
      {proposal.state === EProposalState.Final && (
        <section>
          {nomineeShareBreakdown && (
            <TokenHolderNomineeBreakdown nomineeShareBreakdown={nomineeShareBreakdown} />
          )}
          {shareCapitalBreakdown && (
            <CapitalShareBreakdown
              shareCapitalBreakdown={shareCapitalBreakdown}
              downloadDocument={downloadDocument}
              pendingDownloads={pendingDownloads}
              currency={eto?.shareCapitalCurrencyCode!}
            />
          )}
        </section>
      )}
    </PanelRounded>
  );
};

export { ProposalVotingDetails };
