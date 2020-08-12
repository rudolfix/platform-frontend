import { Percentage } from "@neufund/design-system";
import * as React from "react";
import { FormattedDate, FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { TProposal } from "../../../../modules/shareholder-resolutions-voting/module";
import { DataRow, DataRowSeparated, EDataRowSize } from "../../../shared/DataRow";
import { Heading } from "../../../shared/Heading";
import { EtherscanAddressLink } from "../../../shared/links";

type TExternalProps = { proposal: TProposal; participationPercentage: string };

const ProposalVotingBasicDetails: React.FunctionComponent<TExternalProps> = ({
  proposal,
  participationPercentage,
}) => (
  <>
    <section>
      <Heading level={6} decorator={false} className="text-uppercase mb-2">
        <FormattedMessage id="governance.proposal.vote.details.heading" />
      </Heading>
      <DataRowSeparated
        size={EDataRowSize.SMALL}
        caption={<FormattedMessage id="governance.proposal.vote.details.source" />}
        value={<EtherscanAddressLink address={proposal.votingContractAddress} />}
      />
      <DataRowSeparated
        size={EDataRowSize.SMALL}
        caption={<FormattedMessage id="governance.proposal.vote.details.started" />}
        value={
          <FormattedDate
            value={proposal.startsAt}
            timeZone="UTC"
            timeZoneName="short"
            year="numeric"
            month="short"
            day="numeric"
            hour="numeric"
            minute="numeric"
          />
        }
      />

      {proposal.endsAt > new Date().getTime() ? (
        <DataRow
          size={EDataRowSize.SMALL}
          caption={<FormattedMessage id="governance.proposal.vote.details.ends" />}
          value={<FormattedRelative value={proposal.endsAt} initialNow={new Date()} />}
          className="mb-0"
        />
      ) : (
        <DataRow
          size={EDataRowSize.SMALL}
          caption={<FormattedMessage id="governance.proposal.vote.details.ended" />}
          value={
            <FormattedDate
              timeZone="UTC"
              timeZoneName="short"
              year="numeric"
              month="short"
              day="numeric"
              hour="numeric"
              minute="numeric"
              value={proposal.endsAt}
            />
          }
          className="mb-0"
        />
      )}
    </section>

    <section>
      <Heading level={6} decorator={false} className="text-uppercase mb-2">
        <FormattedMessage id="governance.proposal.vote.statistics.heading" />
      </Heading>

      <DataRowSeparated
        size={EDataRowSize.SMALL}
        caption={<FormattedMessage id="governance.proposal.vote.statistics.participation" />}
        value={
          <Percentage
            value={participationPercentage}
            data-test-id="governance.proposal.voting-details.participation-percentage"
          />
        }
      />

      <DataRow
        size={EDataRowSize.SMALL}
        caption={<FormattedMessage id="governance.proposal.vote.statistics.absolute-majority" />}
        className="mb-0"
        value={
          <Percentage
            value={proposal.quorum}
            data-test-id="governance.proposal.voting-details.quorum"
          />
        }
      />
    </section>
  </>
);

export { ProposalVotingBasicDetails };
