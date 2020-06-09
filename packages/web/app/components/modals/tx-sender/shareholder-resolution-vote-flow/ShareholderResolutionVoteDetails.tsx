import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxType } from "../../../../lib/web3/types";
import { FormatBoolean } from "../../../shared/formatters/FormatBoolean";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

const ShareholderResolutionVoteDetails: TransactionDetailsComponent<ETxType.SHAREHOLDER_RESOLUTIONS_VOTE> = ({
  txTimestamp,
  additionalData,
  className,
}) => (
  <InfoList className={className}>
    <InfoRow
      caption={<FormattedMessage id="governance.proposal.vote.summary.company" />}
      value={additionalData.companyName}
    />

    <InfoRow
      caption={<FormattedMessage id="governance.proposal.vote.summary.resolution" />}
      value={additionalData.proposalTitle}
    />

    <InfoRow
      caption={<FormattedMessage id="governance.proposal.vote.summary.your-vote" />}
      value={<FormatBoolean value={additionalData.voteInFavor} />}
    />

    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

export { ShareholderResolutionVoteDetails };
