import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Container, Row } from "reactstrap";

import { ChartBars, IChartBarsData } from "../../shared/charts/ChartBars";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { PanelWhite } from "../../shared/PanelWhite";

interface IProps {
  tokenCreatedBeforeIco: number;
  tokenCreatedDuringIco: number;
  chartDataTokensOverTime: IChartBarsData;
  chartDataTransactionsOverTime: IChartBarsData;
}

export const EtoTokenIssuance: React.SFC<IProps> = ({
  chartDataTokensOverTime,
  chartDataTransactionsOverTime,
  tokenCreatedBeforeIco,
  tokenCreatedDuringIco,
}) => (
  <PanelWhite>
    <Container>
      <Row>
        <Col>
          <div>
            <h4>
              <FormattedMessage id="eto.overview.token-issuance.number-of-created-token.during-ico" />
            </h4>
            {tokenCreatedDuringIco}
          </div>
          <div>
            <h4>
              <FormattedMessage id="eto.overview.token-issuance.number-of-created-token.before-ico" />
            </h4>
            {tokenCreatedBeforeIco}
          </div>
          <HorizontalLine className="my-3" />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <h3>
            <FormattedMessage id="eto.overview.token-issuance.chart-token-raised-over-time" />
          </h3>
          <small>
            <FormattedMessage id="eto.overview.token-issuance.number-of-investors" />
          </small>
          <ChartBars data={chartDataTokensOverTime} />
        </Col>
        <Col xs={12} md={6}>
          <h3>
            <FormattedMessage id="eto.overview.token-issuance.chart-transactions-over-time" />
          </h3>
          <small>
            <FormattedMessage id="eto.overview.token-issuance.number-of-investors" />
          </small>
          <ChartBars data={chartDataTransactionsOverTime} />
        </Col>
      </Row>
    </Container>
  </PanelWhite>
);
