import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Container, Row } from "reactstrap";

import { ChartBars, IChartBarsData } from "../../shared/charts/ChartBars";
import { PanelWhite } from "../../shared/PanelWhite";
import { TableBody } from "../../shared/table/TableBody";
import { TableCell } from "../../shared/table/TableCell";
import { TableHeader } from "../../shared/table/TableHeader";
import { TableRow } from "../../shared/table/TableRow";

interface IProps {
  chartData: IChartBarsData;
  giniIndex: number;
  tokenDistribution: any[];
}

export const EtoTokenDistribution: React.SFC<IProps> = ({
  chartData,
  giniIndex,
  tokenDistribution,
}) => (
  <PanelWhite>
    <Container>
      <Row className="py-3">
        <Col>
          <span>
            <FormattedMessage id="eto.overview.token-distribution.gini-index" />
          </span>
          <span>{giniIndex}</span>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <TableBody>
            <TableHeader>
              <Container>
                <Row>
                  <Col>
                    <FormattedMessage id="eto.overview.token-distribution.table.header" />
                  </Col>
                </Row>
              </Container>
            </TableHeader>
            <TableRow>
              <TableCell>
                <FormattedMessage id="eto.overview.token-distribution.table.share-of-investors" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="eto.overview.token-distribution.table.share-of-investors" />
              </TableCell>
            </TableRow>
            {tokenDistribution.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data[0]}</TableCell>
                <TableCell>{data[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Col>
        <Col xs={12} md={6}>
          <strong className="mb-2">
            <small>
              <FormattedMessage id="eto.overview.token-distribution.table.chart-description" />
            </small>
          </strong>
          <ChartBars data={chartData} />
        </Col>
      </Row>
    </Container>
  </PanelWhite>
);
