import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../../modules/actions";
import {
  selectTxGasCostEthUlps,
  selectTxSummaryAdditionalData,
  selectTxSummaryData,
} from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { Heading } from "../../../shared/modals/Heading";
import { ECurrency, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

interface IStateProps {
  txData: Partial<ITxData>;
  txCost: string;
  additionalData: { etherNeumarksDue: string; neuBalance: string };
}

interface IDispatchProps {
  onAccept: () => any;
}

type TComponentProps = IStateProps & IDispatchProps;

export const UnlockFundsSummaryComponent: React.FunctionComponent<TComponentProps> = ({
  txCost,
  additionalData,
  onAccept,
}) => (
  <Container>
    <Row className="mb-4">
      <Col>
        <Heading>
          <FormattedMessage id="unlock-funds-flow.summary" />
        </Heading>
      </Col>
    </Row>

    <Row>
      <Col>
        <InfoList>
          <InfoRow
            caption={<FormattedMessage id="unlock-funds-flow.neu-balance" />}
            value={<Money currency={ECurrency.ETH} value={additionalData.neuBalance} />}
          />
          <InfoRow
            caption={<FormattedMessage id="unlock-funds-flow.neumarks-due" />}
            value={<Money currency={ECurrency.ETH} value={additionalData.etherNeumarksDue} />}
          />

          <InfoRow
            caption={<FormattedMessage id="unlock-funds-flow.transaction-cost" />}
            value={<Money currency={ECurrency.ETH} value={txCost} />}
          />
        </InfoList>
      </Col>
    </Row>
    <Row>
      <Col className="text-center">
        <Button
          onClick={onAccept}
          innerClassName="mt-4"
          data-test-id="modals.tx-sender.withdraw-flow.summery.withdrawSummery.accept"
        >
          <FormattedMessage id="withdraw-flow.confirm" />
        </Button>
      </Col>
    </Row>
  </Container>
);

export const UnlockWalletSummary = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    txData: selectTxSummaryData(state)!,
    // TODO REMOVE TXDATA if not required by design
    additionalData: selectTxSummaryAdditionalData(state),
    txCost: selectTxGasCostEthUlps(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(UnlockFundsSummaryComponent);
