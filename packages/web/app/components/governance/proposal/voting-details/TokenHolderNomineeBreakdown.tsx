import { Percentage } from "@neufund/design-system";
import { ENumberInputFormat, ENumberOutputFormat } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import {
  ENomineeVote,
  ITokenHolderBreakdown,
} from "../../../../modules/shareholder-resolutions-voting/types";
import { DataRow, DataRowSeparated, EDataRowSize } from "../../../shared/DataRow";
import { Money } from "../../../shared/formatters/Money";
import { Heading } from "../../../shared/Heading";

type TExternalProps = { nomineeShareBreakdown: ITokenHolderBreakdown };

const TokenHolderNomineeBreakdown: React.FunctionComponent<TExternalProps> = ({
  nomineeShareBreakdown,
}) => (
  <div>
    <Heading level={6} decorator={false} className="text-uppercase mb-2">
      <FormattedMessage id="governance.proposal.shareholder.vote.breakdown.heading" />
    </Heading>

    <DataRowSeparated
      size={EDataRowSize.SMALL}
      caption={<FormattedMessage id="governance.proposal.vote.statistics.yes" />}
      value={
        <>
          <Percentage value={nomineeShareBreakdown.inFavorPercentage} /> (
          <Money
            value={nomineeShareBreakdown.inFavor}
            valueType={nomineeShareBreakdown.tokenSymbol}
            outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
            inputFormat={ENumberInputFormat.ULPS}
            decimals={nomineeShareBreakdown.decimals}
          />
          )
        </>
      }
    />

    <DataRowSeparated
      size={EDataRowSize.SMALL}
      caption={<FormattedMessage id="governance.proposal.vote.statistics.no" />}
      value={
        <>
          <Percentage value={nomineeShareBreakdown.againstPercentage} /> (
          <Money
            value={nomineeShareBreakdown.against}
            valueType={nomineeShareBreakdown.tokenSymbol}
            outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
            inputFormat={ENumberInputFormat.ULPS}
            decimals={nomineeShareBreakdown.decimals}
          />
          )
        </>
      }
    />

    <DataRowSeparated
      size={EDataRowSize.SMALL}
      caption={<FormattedMessage id="governance.proposal.vote.statistics.abstained" />}
      value={
        <>
          <Percentage value={nomineeShareBreakdown.abstainPercentage} /> (
          <Money
            value={nomineeShareBreakdown.abstain}
            valueType={nomineeShareBreakdown.tokenSymbol}
            outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
            inputFormat={ENumberInputFormat.ULPS}
            decimals={nomineeShareBreakdown.decimals}
          />
          )
        </>
      }
    />

    <DataRowSeparated
      size={EDataRowSize.SMALL}
      caption={<FormattedMessage id="governance.proposal.vote.statistics.total.token" />}
      value={
        <Money
          value={nomineeShareBreakdown.totalTokens}
          valueType={nomineeShareBreakdown.tokenSymbol}
          outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          inputFormat={ENumberInputFormat.ULPS}
          decimals={nomineeShareBreakdown.decimals}
        />
      }
    />

    <DataRow
      size={EDataRowSize.SMALL}
      caption={
        <>
          {nomineeShareBreakdown.nomineeName}{" "}
          <FormattedMessage id="governance.proposal.vote.statistics.nominee.vote" />
        </>
      }
      className="mb-0"
      value={
        nomineeShareBreakdown.nomineeVote === ENomineeVote.AGAINST ? (
          <FormattedMessage id="governance.proposal.vote.statistics.nominee.no" />
        ) : (
          <FormattedMessage id="governance.proposal.vote.statistics.nominee.yes" />
        )
      }
    />
  </div>
);

export { TokenHolderNomineeBreakdown };
