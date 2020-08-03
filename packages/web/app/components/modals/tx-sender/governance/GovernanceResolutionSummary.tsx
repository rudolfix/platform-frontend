import { Button } from "@neufund/design-system";
import { nonNullable } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxType } from "../../../../lib/web3/types";
import { actions } from "../../../../modules/actions";
import { selectTxAdditionalData } from "../../../../modules/tx/sender/selectors";
import { TExecuteResolutionAdditionalData } from "../../../../modules/tx/transactions/governance/types";
import { appConnect } from "../../../../store";
import { Container } from "../../../layouts/Container";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

interface IStateProps {
  additionalData: TExecuteResolutionAdditionalData;
}

interface IDispatchProps {
  onAccept: () => void;
}

type TGovernanceResolutionSummaryProps = IStateProps & IDispatchProps;

const GovernanceResolutionSummaryBase: React.FunctionComponent<TGovernanceResolutionSummaryProps> = ({
  onAccept,
  additionalData,
}) => (
  <Container>
    <Heading className="mb-4" size={EHeadingSize.SMALL} level={4}>
      <FormattedMessage id="governance.publish-update" />
    </Heading>

    <InfoList>
      <InfoRow
        caption={<FormattedMessage id="governance.document-title" />}
        value={additionalData.documentTitle}
      />
      <InfoRow
        caption={<FormattedMessage id="governance.update-type" />}
        value={additionalData.type}
      />
    </InfoList>

    <section className="text-center">
      <Button onClick={onAccept} data-test-id="tx.shareholder-resolution-vote.summary.confirm">
        <FormattedMessage id="general-flow.confirm" />
      </Button>
    </section>
  </Container>
);

export const GovernanceResolutionSummary = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    additionalData: nonNullable(selectTxAdditionalData<ETxType.EXECUTE_RESOLUTION>(state)),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(GovernanceResolutionSummaryBase);
