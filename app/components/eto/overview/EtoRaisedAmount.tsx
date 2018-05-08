import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Container, Row } from "reactstrap";

import { ChartBars, IChartBarsData } from "../../shared/charts/ChartBars";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { Money } from "../../shared/Money";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";
import { PanelWhite } from "../../shared/PanelWhite";
import { PercentageIndicatorBar } from "../../shared/PercentageIndicatorBar";


import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";

interface IProps {
  chartData: IChartBarsData;
  firstTransactionTime: string;
  lastTransactionTime: string;
}

export const EtoRaisedAmount: React.SFC<IProps> = ({
  chartData,
  firstTransactionTime,
  lastTransactionTime,
}) => (
  <PanelWhite>
    <Container>
      <Row>
        <Col>
          <div>
            <FormattedMessage id="eto.overview.raised-amount.total" />
            <Money theme="t-green" value={"1234567" + "0".repeat(16)} currency="eur" />
            <MoneySuiteWidget
              currency="eur_token"
              largeNumber={"1234567" + "0".repeat(16)}
              value={"1234567" + "0".repeat(16)}
              currencyTotal="eur"
              icon={moneyIcon}
            />
            <MoneySuiteWidget
              currency="eth"
              largeNumber={"1234567" + "0".repeat(16)}
              value={"1234567" + "0".repeat(16)}
              currencyTotal="eur"
              icon={ethIcon}
            />
            <PercentageIndicatorBar percent={76} />
            <Money value={"1234567" + "0".repeat(14)} currency="eur" />
          </div>
          <HorizontalLine className="my-3" />
          <div>
            <h4>
              <FormattedMessage id="eto.overview.raised-amount.raised-over-time" />
            </h4>
            <div>
              <strong>
                <FormattedMessage id="eto.overview.raised-amount.transaction-time.first" />
              </strong>
              <span>{firstTransactionTime}</span>
            </div>
            <div>
              <strong>
                <FormattedMessage id="eto.overview.raised-amount.transaction-time.last" />
              </strong>
              <span>{lastTransactionTime}</span>
            </div>
            <ChartBars data={chartData} />
          </div>
        </Col>
      </Row>
    </Container>
  </PanelWhite>
);
