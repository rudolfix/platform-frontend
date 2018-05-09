import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { PanelWhite } from "../shared/PanelWhite";
import { SectionHeader } from "../shared/SectionHeader";
import { EtoFundsDistribution } from "./overview/EtoFundsDistribution";
import { EtoOverviewStatus } from "./overview/EtoOverviewStatus";
import { EtoRaisedAmount } from "./overview/EtoRaisedAmount";
import { EtoTokenDistribution } from "./overview/EtoTokenDistribution";
import { EtoTokenIssuance } from "./overview/EtoTokenIssuance";

const chartBarData = {
  labels: ["Lorem", "Ipsum", "Dit", "Sit", "Amet", "Blah", "Lorem", "Ipsum"],
  datasets: [
    {
      data: [130, 50, 20, 40, 50, 12, 100, 87],
      backgroundColor: [
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
      ],
    },
  ],
};

const tokenIcon = "../../assets/img/nEUR_icon.svg";

export const EtoOverview: React.SFC = () => (
  <LayoutAuthorized>
    <SectionHeader>
      <FormattedMessage id="eto.overview.header.status" />
    </SectionHeader>

    <Row className="py-4">
      <Col>
        <EtoOverviewStatus
        cap="HARD CAP: 750M EDT"
        duration="22.02.2018 to 22.5.2019"
        tokensSupply="50000000"
        tokenName="ABC"
        tokenImg={tokenIcon} />
      </Col>
    </Row>

    <SectionHeader>
      <FormattedMessage id="eto.overview.header.raised-amount" />
    </SectionHeader>

    <Row className="py-4">
      <Col>
        <EtoRaisedAmount
          firstTransactionTime="yesterday"
          lastTransactionTime="yesterday"
          chartData={chartBarData}
        />
      </Col>
    </Row>

    <SectionHeader>
      <FormattedMessage id="eto.overview.header.funds-distribution" />
    </SectionHeader>

    <Row className="py-4">
      <Col>
        <EtoFundsDistribution
          investors={[
            {
              name: "Name",
              invested: "1234567" + "0".repeat(16),
              value: 12344455,
              tokens: 4,
            },
            {
              name: "Name",
              invested: "1234567" + "0".repeat(16),
              value: 12344455,
              tokens: 4,
            },
          ]}
          numberOfInvestors={2}
          numberOfTransactions={12}
          chartDataNTotalAmountInvested={chartBarData}
          chartDataNumberOfInvestors={chartBarData}
        />
      </Col>
    </Row>

    <SectionHeader>
      <FormattedMessage id="eto.overview.header.token-issuance" />
    </SectionHeader>

    <Row className="py-4">
      <Col>
        <EtoTokenIssuance
          tokenCreatedBeforeIco={12345}
          tokenCreatedDuringIco={12345}
          chartDataTokensOverTime={chartBarData}
          chartDataTransactionsOverTime={chartBarData}
        />
      </Col>
    </Row>

    <SectionHeader>
      <FormattedMessage id="eto.overview.header.token-distribution" />
    </SectionHeader>

    <Row className="py-4">
      <Col>
        <EtoTokenDistribution
          chartData={chartBarData}
          giniIndex={0.6162}
          tokenDistribution={[["1%", "1%"], ["1%", "1%"], ["1%", "1%"]]}
        />
      </Col>
    </Row>
  </LayoutAuthorized>
);
