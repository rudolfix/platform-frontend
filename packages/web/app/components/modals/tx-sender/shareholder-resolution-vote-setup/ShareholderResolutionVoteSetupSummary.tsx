import { Button } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container } from "reactstrap";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { EHeadingSize, Heading } from "../../../shared/Heading";

interface IDispatchProps {
  onAccept: () => void;
}

type TComponentProps = IDispatchProps;

export const ShareholderResolutionVoteSetupSummaryLayout: React.FunctionComponent<TComponentProps> = ({
  onAccept,
}) => (
  <Container>
    <Heading className="mb-4" size={EHeadingSize.SMALL} level={4}>
      <FormattedMessage id="shareholder-resolution-voting-setup.title" />
    </Heading>

    <section className="text-center">
      <Button onClick={onAccept} data-test-id="tx.shareholder-resolution-vote-setup.summary.confirm">
        <FormattedMessage id="general-flow.confirm" />
      </Button>
    </section>
  </Container>
);

export const ShareholderResolutionVoteSetupSummary = appConnect<IDispatchProps>({
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(ShareholderResolutionVoteSetupSummaryLayout);
