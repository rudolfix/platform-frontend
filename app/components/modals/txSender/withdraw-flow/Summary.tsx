import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { Button } from "../../../shared/Buttons";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ISummaryComponentProps } from "../TxSender";
import { Money } from "../../../shared/Money";
import { GweiFormatter } from "./Withdraw";

export const WithdrawSummary: React.SFC<ISummaryComponentProps> = ({ data, onAccept }) => (
  <>
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
          <InfoRow caption={<FormattedMessage id="withdraw-flow.to" />} value={data.to} />

          <InfoRow
            caption={<FormattedMessage id="withdraw-flow.cost" />}
            value={<Money currency="eth" value={data.value!} />}
          />

          <InfoRow caption={<FormattedMessage id="withdraw-flow.gas" />} value={data.gas!} />

          <InfoRow
            caption={<FormattedMessage id="withdraw-flow.gasPrice" />}
            value={<GweiFormatter value={data.gasPrice!} />}
          />
        </InfoList>
      </Col>
    </Row>

    <Row>
      <Col className="text-center">
        <Button onClick={onAccept} className="mt-4">
          Accept
        </Button>
      </Col>
    </Row>
  </>
);
