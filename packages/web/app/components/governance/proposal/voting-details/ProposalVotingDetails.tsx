import { Button, EButtonLayout, EButtonWidth } from "@neufund/design-system";
import { TEtoWithCompanyAndContract } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage, FormattedHTMLMessage } from "react-intl";

import { IImmutableFileId } from "../../../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { shareholderResolutionsVotingModuleApi } from "../../../../modules/shareholder-resolutions-voting/module";
import {
  EProposalState,
  IShareCapitalBreakdown,
  ITokenHolderBreakdown,
  TProposal,
} from "../../../../modules/shareholder-resolutions-voting/types";
import { Heading } from "../../../shared/Heading";
import { EPanelPadding, PanelRounded } from "../../../shared/Panel";
import { UploadVotingResultsModal } from "../UploadVotingResultsModal";
import { CapitalShareBreakdown } from "./CapitalShareBreakdown";
import { ProposalVotingBasicDetails } from "./PoposalVotingBasicDetails";
import { TokenHolderNomineeBreakdown } from "./TokenHolderNomineeBreakdown";
import { EVotingStateLayout, VotingStateWidget } from "./VotingStateWidget";

import * as styles from "./ProposalVotingDetails.module.scss";

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
  const [showUploadResultsModal, setShowUploadResultsModal] = React.useState(false);

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
        <section className={styles.tallySection}>
          {nomineeShareBreakdown && (
            <TokenHolderNomineeBreakdown nomineeShareBreakdown={nomineeShareBreakdown} />
          )}

          <Heading level={6} decorator={false} className="text-uppercase">
            <FormattedMessage id="governance.proposal.capital.share.breakdown.heading" />
          </Heading>

          <VotingStateWidget layout={EVotingStateLayout.WAITING}>
            <FormattedMessage id="governance.proposal.voting.details.waiting.for.votes" />
          </VotingStateWidget>

          <div className={styles.submitBy}>
            <FormattedHTMLMessage
              tagName="span"
              id="governance.proposal.voting.details.submit-by"
            />
          </div>

          <Button
            layout={EButtonLayout.PRIMARY}
            width={EButtonWidth.BLOCK}
            onClick={() => setShowUploadResultsModal(true)}
          >
            <FormattedMessage id="governance.proposal.voting.details.submit-final-results" />
          </Button>

          <UploadVotingResultsModal
            isOpen={showUploadResultsModal}
            onClose={() => setShowUploadResultsModal(false)}
          />
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
