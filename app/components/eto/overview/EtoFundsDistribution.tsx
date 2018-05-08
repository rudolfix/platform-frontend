import * as React from "react";

import { FormattedMessage } from "react-intl";
import { Col, Container, Row } from "reactstrap";
import { ChartBars, IChartBarsData } from "../../shared/charts/ChartBars";
import { PanelWhite } from "../../shared/PanelWhite";
import { TableBody } from "../../shared/table/TableBody";
import { TableCell } from "../../shared/table/TableCell";
import { TableHeader } from "../../shared/table/TableHeader";
import { TableRow } from "../../shared/table/TableRow";

interface IInvestor {
  name: string;
  invested: string;
  value: number;
  tokens: number;
}

interface IProps {
  investors: IInvestor[];
  chartDataNumberOfInvestors: IChartBarsData;
  chartDataNTotalAmountInvested: IChartBarsData;
  numberOfInvestors: number;
  numberOfTransactions: number;
}

export const EtoFundsDistribution: React.SFC<IProps> = ({
  chartDataNumberOfInvestors,
  chartDataNTotalAmountInvested,
  investors,
  numberOfInvestors,
  numberOfTransactions,
}) => (
  <PanelWhite>
    <Container>
      <Row>
        <Col xs={12} md={6}>
          <div>
            <div>
              <FormattedMessage id="eto.overview.funds-distribution.number-of-investors" />
              {numberOfInvestors}
            </div>
            <div>
              <FormattedMessage id="eto.overview.funds-distribution.number-of-investors" />
              {numberOfTransactions}
            </div>
          </div>
          <TableBody>
            <TableHeader>
              <Container>
                <Row>
                  <Col>
                    <FormattedMessage id="eto.overview.funds-distribution.table.header" />
                  </Col>
                </Row>
              </Container>
            </TableHeader>
            <TableRow>
              <TableCell>
                <FormattedMessage id="eto.overview.funds-distribution.table.name" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="eto.overview.funds-distribution.table.invested" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="eto.overview.funds-distribution.table.value-eur" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="eto.overview.funds-distribution.table.tokens" />
              </TableCell>
            </TableRow>
            {investors.map((investor, index) => (
              <TableRow key={index}>
                <TableCell>{investor.name}</TableCell>
                <TableCell>{investor.invested}</TableCell>
                <TableCell>{investor.value}</TableCell>
                <TableCell>{investor.tokens}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Col>
        <Col xs={12} md={6}>
          <div>
            <h3>
              <FormattedMessage id="eto.overview.token-distribution.table.number-of-investors-header" />
            </h3>
            <strong className="mb-2">
              <small>
                <FormattedMessage id="eto.overview.token-distribution.table.number-of-investors" />
              </small>
            </strong>
            <ChartBars data={chartDataNumberOfInvestors} />
          </div>
          <div>
            <h3>
              <FormattedMessage id="eto.overview.token-distribution.table.number-of-investors-header" />
            </h3>
            <strong className="mb-2">
              <small>
                <FormattedMessage id="eto.overview.token-distribution.table.number-of-investors" />
              </small>
            </strong>
            <ChartBars data={chartDataNTotalAmountInvested} />
          </div>
        </Col>
      </Row>
    </Container>
  </PanelWhite>
);
