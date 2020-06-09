import * as React from "react";
import { FormattedDate, FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { shareholderResolutionsVotingModuleApi } from "../../../modules/shareholder-resolutions-voting/module";
import { TProposal } from "../../../modules/shareholder-resolutions-voting/types";
import { DataRow, DataRowSeparated, EDataRowSize } from "../../shared/DataRow";
import { Money } from "../../shared/formatters/Money";
import { MoneyWithLessThan } from "../../shared/formatters/MoneyWithLessThan";
import {
  ENumberFormat,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../shared/formatters/utils";
import { Heading } from "../../shared/Heading";
import { EtherscanAddressLink } from "../../shared/links";
import { EPanelPadding, PanelRounded } from "../../shared/Panel";

type TExternalProps = { proposal: TProposal };

const ProposalVotingDetails: React.FunctionComponent<TExternalProps> = ({ proposal }) => {
  const calculateParticipation = shareholderResolutionsVotingModuleApi.utils.calculateParticipation(
    proposal,
  );

  return (
    <PanelRounded padding={EPanelPadding.NORMAL}>
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

        <DataRow
          size={EDataRowSize.SMALL}
          caption={<FormattedMessage id="governance.proposal.vote.details.ends" />}
          value={<FormattedRelative value={proposal.endsAt} initialNow={new Date()} />}
          className="mb-0"
        />
      </section>

      <section>
        <Heading level={6} decorator={false} className="text-uppercase mb-2">
          <FormattedMessage id="governance.proposal.vote.statistics.heading" />
        </Heading>

        <DataRowSeparated
          size={EDataRowSize.SMALL}
          caption={<FormattedMessage id="governance.proposal.vote.statistics.participation" />}
          value={
            <MoneyWithLessThan
              value={calculateParticipation}
              inputFormat={ENumberInputFormat.FLOAT}
              outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              valueType={ENumberFormat.PERCENTAGE}
            />
          }
        />

        <DataRow
          size={EDataRowSize.SMALL}
          caption={<FormattedMessage id="governance.proposal.vote.statistics.absolute-majority" />}
          className="mb-0"
          value={
            <Money
              value={proposal.quorum}
              inputFormat={ENumberInputFormat.FLOAT}
              outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              valueType={ENumberFormat.PERCENTAGE}
            />
          }
        />
      </section>
    </PanelRounded>
  );
};

export { ProposalVotingDetails };
