import { Button } from "@neufund/design-system";
import { nonNullable } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container } from "reactstrap";

import { ETxType } from "../../../../lib/web3/types";
import { actions } from "../../../../modules/actions";
import { selectTxAdditionalData } from "../../../../modules/tx/sender/selectors";
import { TShareholderResolutionVoteAdditionalData } from "../../../../modules/tx/transactions/shareholder-resolution-vote/types";
import { appConnect } from "../../../../store";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { ShareholderResolutionVoteDetails } from "./ShareholderResolutionVoteDetails";

interface IStateProps {
  additionalData: TShareholderResolutionVoteAdditionalData;
}

interface IDispatchProps {
  onAccept: () => void;
}

type TComponentProps = IStateProps & IDispatchProps;

export const ShareholderResolutionVoteSummaryLayout: React.FunctionComponent<TComponentProps> = ({
  onAccept,
  additionalData,
}) => (
  <Container>
    <Heading className="mb-4" size={EHeadingSize.SMALL} level={4}>
      <FormattedMessage id="shareholder-resolution-vote.summary" />
    </Heading>

    <ShareholderResolutionVoteDetails additionalData={additionalData} className="mb-4" />

    <section className="text-center">
      <Button onClick={onAccept} data-test-id="tx.shareholder-resolution-vote.summary.confirm">
        <FormattedMessage id="general-flow.confirm" />
      </Button>
    </section>
  </Container>
);

export const ShareholderResolutionVoteSummary = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    additionalData: nonNullable(
      selectTxAdditionalData<ETxType.SHAREHOLDER_RESOLUTIONS_VOTE>(state),
    ),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(ShareholderResolutionVoteSummaryLayout);
