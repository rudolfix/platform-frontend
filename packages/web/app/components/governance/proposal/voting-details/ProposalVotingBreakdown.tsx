import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import { shareholderResolutionsVotingModuleApi } from "../../../../modules/shareholder-resolutions-voting/module";
import { TProposal } from "../../../../modules/shareholder-resolutions-voting/types";
import { DataRow, DataRowSeparated, EDataRowSize } from "../../../shared/DataRow";
import { Money } from "../../../shared/formatters/Money";
import { MoneyWithLessThan } from "../../../shared/formatters/MoneyWithLessThan";
import {
  ENumberFormat,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../shared/formatters/utils";
import { Heading } from "../../../shared/Heading";
import { EPanelPadding, PanelRounded } from "../../../shared/Panel";
import { ProposalVotingBasicDetails } from "./PoposalVotingBasicDetails";

type TExternalProps = {
  proposal: TProposal;
  eto: Pick<TEtoWithCompanyAndContract, "equityTokenSymbol">;
};

const ProposalVotingBreakdown: React.FunctionComponent<TExternalProps> = ({ proposal, eto }) => {
  const {
    participationPercentage,
    inFavorParticipationPercentage,
    againstParticipationPercentage,
    abstainedParticipationPercentage,
    abstainedParticipationTokens,
  } = React.useMemo(
    () => ({
      participationPercentage: shareholderResolutionsVotingModuleApi.utils.calculateParticipationPercentage(
        proposal,
      ),
      inFavorParticipationPercentage: shareholderResolutionsVotingModuleApi.utils.calculateInFavorParticipationPercentage(
        proposal,
      ),
      againstParticipationPercentage: shareholderResolutionsVotingModuleApi.utils.calculateAgainstParticipationPercentage(
        proposal,
      ),
      abstainedParticipationPercentage: shareholderResolutionsVotingModuleApi.utils.calculateAbstainedParticipationPercentage(
        proposal,
      ),
      abstainedParticipationTokens: shareholderResolutionsVotingModuleApi.utils.calculateAbstainedParticipationTokens(
        proposal,
      ),
    }),
    [proposal],
  );

  return (
    <PanelRounded padding={EPanelPadding.NORMAL}>
      <ProposalVotingBasicDetails
        proposal={proposal}
        participationPercentage={participationPercentage}
      />

      <section>
        <Heading level={6} decorator={false} className="text-uppercase mb-2">
          <FormattedMessage id="governance.proposal.vote.breakdown.heading" />
        </Heading>

        <DataRowSeparated
          size={EDataRowSize.SMALL}
          caption={<FormattedMessage id="governance.proposal.vote.breakdown.in-favor" />}
          value={
            <>
              <MoneyWithLessThan
                value={inFavorParticipationPercentage}
                inputFormat={ENumberInputFormat.FLOAT}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                valueType={ENumberFormat.PERCENTAGE}
              />{" "}
              (
              <Money
                value={proposal.tally.inFavor}
                // TODO: Get input format from token precision
                inputFormat={ENumberInputFormat.FLOAT}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                valueType={eto.equityTokenSymbol}
              />
              )
            </>
          }
        />

        <DataRowSeparated
          size={EDataRowSize.SMALL}
          caption={<FormattedMessage id="governance.proposal.vote.breakdown.against" />}
          value={
            <>
              <MoneyWithLessThan
                value={againstParticipationPercentage}
                inputFormat={ENumberInputFormat.FLOAT}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                valueType={ENumberFormat.PERCENTAGE}
              />{" "}
              (
              <Money
                value={proposal.tally.against}
                // TODO: Get input format from token precision
                inputFormat={ENumberInputFormat.FLOAT}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                valueType={eto.equityTokenSymbol}
              />
              )
            </>
          }
        />

        <DataRowSeparated
          size={EDataRowSize.SMALL}
          caption={<FormattedMessage id="governance.proposal.vote.breakdown.abstained" />}
          value={
            <>
              <MoneyWithLessThan
                value={abstainedParticipationPercentage}
                inputFormat={ENumberInputFormat.FLOAT}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                valueType={ENumberFormat.PERCENTAGE}
              />{" "}
              (
              <Money
                value={abstainedParticipationTokens}
                // TODO: Get input format from token precision
                inputFormat={ENumberInputFormat.FLOAT}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                valueType={eto.equityTokenSymbol}
              />
              )
            </>
          }
        />

        <DataRow
          size={EDataRowSize.SMALL}
          caption={<FormattedMessage id="governance.proposal.vote.breakdown.total" />}
          className="mb-0"
          value={
            <Money
              value={proposal.tally.tokenVotingPower}
              // TODO: Get input format from token precision
              inputFormat={ENumberInputFormat.FLOAT}
              outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              valueType={eto.equityTokenSymbol}
            />
          }
        />
      </section>
    </PanelRounded>
  );
};

export { ProposalVotingBreakdown };
