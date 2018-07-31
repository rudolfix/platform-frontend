import * as React from "react";
import { ListGroup, Row } from "reactstrap";
import { FormattedMessage } from "react-intl-phraseapp";

import { InfoList } from "../shared/InfoList";
import { ITxData } from "../../../../modules/tx/sender/reducer";
import { Heading } from "../../../shared/modals/Heading";
import { InfoRow } from "../shared/InfoRow";

export const WithdrawSummary: React.SFC<ITxData> = () => (
  <>
    <Row className="mb-5">
      <Heading>
        <FormattedMessage id="investment-flow.withdraw-summary" />
      </Heading>
    </Row>

    <Row>
      <InfoList>
        <InfoRow caption="test" value="abc" />
        <InfoRow caption="test" value="abc" />
        <InfoRow caption="test" value="abc" />
        <InfoRow caption="test" value="abc" />
      </InfoList>
    </Row>
  </>
);
