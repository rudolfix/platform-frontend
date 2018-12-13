import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { actions } from "../../../../modules/actions";
import {
  selectTxGasCostEthUlps,
  selectTxSummaryData,
} from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { Heading } from "../../../shared/modals/Heading";
import { ECurrency, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ITxSummaryDispatchProps, ITxSummaryStateProps, TSummaryComponentProps } from "../TxSender";

export const WithdrawSummaryComponent: React.SFC<TSummaryComponentProps> = ({
  txData,
  txCost,
  onAccept,
}) => (
  <Container>
    <Row className="mb-4">
      <Col>
        <Heading>
          <FormattedMessage id="withdraw-flow.summary" />
        </Heading>
      </Col>
    </Row>

    <Row>
      <Col>
        <InfoList>
          <InfoRow caption={<FormattedMessage id="withdraw-flow.to" />} value={txData.to} />

          <InfoRow
            caption={<FormattedMessage id="withdraw-flow.value" />}
            value={<Money currency={ECurrency.ETH} value={txData.value!} />}
          />

          <InfoRow
            caption={<FormattedMessage id="withdraw-flow.transaction-cost" />}
            value={<Money currency={ECurrency.ETH} value={txCost} />}
          />
        </InfoList>
      </Col>
    </Row>
    <Row>
      <Col className="text-center">
        <Button
          onClick={onAccept}
          className="mt-4"
          data-test-id="modals.tx-sender.withdraw-flow.summery.withdrawSummery.accept"
        >
          <FormattedMessage id="withdraw-flow.confirm" />
        </Button>
      </Col>
    </Row>
  </Container>
);

export const WithdrawSummary = appConnect<ITxSummaryStateProps, ITxSummaryDispatchProps>({
  stateToProps: state => ({
    txData: selectTxSummaryData(state)!,
    txCost: selectTxGasCostEthUlps(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(WithdrawSummaryComponent);
