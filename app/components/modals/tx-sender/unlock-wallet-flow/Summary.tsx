import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { PLATFORM_UNLOCK_FEE } from "../../../../config/constants";
import { actions } from "../../../../modules/actions";
import { selectTxGasCostEthUlps } from "../../../../modules/tx/sender/selectors";
import {
  selectEtherLockedNeumarksDue,
  selectLockedEtherBalance,
} from "../../../../modules/wallet/selectors";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { Heading } from "../../../shared/modals/Heading";
import { ECurrency, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

interface IStateProps {
  txCost: string;
  neumarksDue: string;
  etherLockedBalance: string;
}

interface IDispatchProps {
  onAccept: () => any;
}

type TComponentProps = IStateProps & IDispatchProps;

export const UnlockFundsSummaryComponent: React.FunctionComponent<TComponentProps> = ({
  txCost,
  neumarksDue,
  etherLockedBalance,
  onAccept,
}) => {
  const etherLockedBalanceBN = new BigNumber(etherLockedBalance);
  const returnedEther = etherLockedBalanceBN.minus(etherLockedBalanceBN.mul(PLATFORM_UNLOCK_FEE));
  return (
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
              caption={<FormattedMessage id="unlock-funds-flow.eth-committed" />}
              value={<Money currency={ECurrency.ETH} value={etherLockedBalance} />}
            />
            <InfoRow
              caption={<FormattedMessage id="unlock-funds-flow.neumarks-due" />}
              value={<Money currency={ECurrency.ETH} value={neumarksDue} />}
            />
            <InfoRow caption={<FormattedMessage id="unlock-funds-flow.fee" />} value={null} />
            <InfoRow
              caption={<FormattedMessage id="unlock-funds-flow.amount-returned" />}
              value={<Money currency={ECurrency.ETH} value={returnedEther} />}
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
            data-test-id="modals.tx-sender.withdraw-flow.summery.unlock-funds-summary.accept"
          >
            <FormattedMessage id="withdraw-flow.confirm" />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export const UnlockWalletSummary = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    txCost: selectTxGasCostEthUlps(state),
    neumarksDue: selectEtherLockedNeumarksDue(state),
    etherLockedBalance: selectLockedEtherBalance(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(UnlockFundsSummaryComponent);
