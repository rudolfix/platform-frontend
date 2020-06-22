import { Button, ButtonGroup, EButtonGroupSize, EButtonLayout } from "@neufund/design-system";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { shareholderResolutionsVotingModuleApi } from "../../../modules/shareholder-resolutions-voting/module";
import {
  EShareholderVoteResolution,
  IShareholderVote,
  TProposal,
} from "../../../modules/shareholder-resolutions-voting/types";
import { EContainerType } from "../../layouts/Container";
import { FormatBoolean } from "../../shared/formatters/FormatBoolean";
import { ECurrencySymbol, Money } from "../../shared/formatters/Money";
import { MoneyWithLessThan } from "../../shared/formatters/MoneyWithLessThan";
import {
  ENumberFormat,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../shared/formatters/utils";
import { Heading } from "../../shared/Heading";
import { PanelGray } from "../../shared/Panel";

import * as styles from "./ProposalShareholderVoteWidget.module.scss";

type TExternalProps = {
  proposal: TProposal;
  shareholderVote: IShareholderVote;
  eto: Pick<TEtoWithCompanyAndContract, "equityTokenSymbol">;
  voteYes: () => void;
  voteNo: () => void;
};

const ProposalShareholderVote: React.FunctionComponent<TExternalProps> = ({
  voteYes,
  voteNo,
  shareholderVote,
  proposal,
  eto,
}) => {
  const shareholderParticipationPercentage = shareholderResolutionsVotingModuleApi.utils.calculateShareholderParticipationPercentage(
    shareholderVote,
    proposal,
  );

  return (
    <PanelGray
      type={EContainerType.CONTAINER}
      data-test-id="governance.proposal.shareholder-vote-widget.vote"
    >
      <Heading level={6} decorator={false} className="text-uppercase mb-2">
        <FormattedMessage id="governance.proposal.vote.heading" />
      </Heading>

      <p className={cn(styles.message, "mb-3")}>
        <FormattedMessage
          id="governance.proposal.vote.paragraph"
          values={{
            numberOfTokens: (
              <Money
                className={cn(styles.highlight)}
                // TODO: Get input format from token precision
                inputFormat={ENumberInputFormat.FLOAT}
                value={shareholderVote.votingPower}
                valueType={eto.equityTokenSymbol}
                currencySymbol={ECurrencySymbol.NONE}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                data-test-id="governance.proposal.shareholder-vote-widget.number-of-tokens"
              />
            ),
            percentageAllTokens: (
              <MoneyWithLessThan
                className={cn(styles.highlight)}
                value={shareholderParticipationPercentage}
                inputFormat={ENumberInputFormat.FLOAT}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                valueType={ENumberFormat.PERCENTAGE}
                data-test-id="governance.proposal.shareholder-vote-widget.percentage-of-tokens"
              />
            ),
          }}
        />
      </p>

      <ButtonGroup size={EButtonGroupSize.SMALL} className={styles.buttons}>
        <Button
          className={styles.button}
          layout={EButtonLayout.PRIMARY}
          onClick={voteYes}
          data-test-id="governance.proposal.shareholder-vote-widget.vote-in-favor"
        >
          <FormattedMessage id="governance.proposal.vote.vote-yes" />
        </Button>
        <Button
          className={styles.button}
          layout={EButtonLayout.SECONDARY}
          onClick={voteNo}
          data-test-id="governance.proposal.shareholder-vote-widget.vote-against"
        >
          <FormattedMessage id="governance.proposal.vote.vote-no" />
        </Button>
      </ButtonGroup>
    </PanelGray>
  );
};

const ProposalShareholderVoteResult: React.FunctionComponent<TExternalProps> = ({
  shareholderVote,
  proposal,
  eto,
}) => {
  const shareholderParticipation = shareholderResolutionsVotingModuleApi.utils.calculateShareholderParticipationPercentage(
    shareholderVote,
    proposal,
  );

  return (
    <PanelGray data-test-id="governance.proposal.shareholder-vote-widget.vote-details">
      <p className={cn(styles.message, "mb-0")}>
        <FormattedMessage
          id="governance.proposal.vote-result.paragraph"
          values={{
            vote: (
              <span
                className={cn(styles.highlight)}
                data-test-id="governance.proposal.shareholder-vote-widget.vote"
              >
                “
                <FormatBoolean
                  value={shareholderVote.state !== EShareholderVoteResolution.Against}
                />
                ”
              </span>
            ),
            numberOfTokens: (
              <Money
                className={cn(styles.highlight)}
                // TODO: Get input format from token precision
                inputFormat={ENumberInputFormat.FLOAT}
                value={shareholderVote.votingPower}
                valueType={eto.equityTokenSymbol}
                currencySymbol={ECurrencySymbol.NONE}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                data-test-id="governance.proposal.shareholder-vote-widget.number-of-tokens"
              />
            ),
            percentageAllTokens: (
              <MoneyWithLessThan
                className={cn(styles.highlight)}
                value={shareholderParticipation}
                inputFormat={ENumberInputFormat.FLOAT}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                valueType={ENumberFormat.PERCENTAGE}
                data-test-id="governance.proposal.shareholder-vote-widget.percentage-of-tokens"
              />
            ),
          }}
        />
      </p>
    </PanelGray>
  );
};

const ProposalShareholderVoteWidget = compose<TExternalProps, TExternalProps>(
  branch<TExternalProps>(
    props => props.shareholderVote.state === EShareholderVoteResolution.Abstain,
    renderComponent(ProposalShareholderVote),
  ),
)(ProposalShareholderVoteResult);

export { ProposalShareholderVoteWidget };
