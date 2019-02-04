import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { ITokenDisbursal } from "../../modules/investor-portfolio/types";
import { isZero } from "../../utils/Number.utils";
import { LoadingIndicator } from "./loading-indicator";
import { ECurrency, ETheme, Money, selectCurrencyCode } from "./Money";
import { NewTable, NewTableRow } from "./NewTable";
import { Panel } from "./Panel";
import { SectionHeader } from "./SectionHeader";

import * as ethIcon from "../../assets/img/eth_icon.svg";
import * as nEurIcon from "../../assets/img/nEUR_icon.svg";

interface IExternalProps {
  tokensDisbursal: ReadonlyArray<ITokenDisbursal> | undefined;
}

interface ILayoutProps {
  tokensDisbursal: ReadonlyArray<ITokenDisbursal>;
}

// TODO: move as a reusable component
const CurrencyIcon: React.FunctionComponent<{ currency: ECurrency }> = ({ currency }) => {
  switch (currency) {
    case ECurrency.EUR_TOKEN:
      return <img src={nEurIcon} alt="NEur token" />;
    case ECurrency.ETH:
      return <img src={ethIcon} alt="Ether token" />;
    default:
      throw new Error(`Icon for currency ${currency} not found`);
  }
};

const AssetPortfolioLayoutNoPayouts: React.FunctionComponent = () => (
  <SectionHeader
    layoutHasDecorator={false}
    className="mb-4"
    description={<FormattedMessage id="portfolio.asset.payouts-from-neu.no-payouts" />}
  >
    <FormattedMessage id="portfolio.section.asset-portfolio.title" />
  </SectionHeader>
);

const AssetPortfolioLayout: React.FunctionComponent<ILayoutProps> = ({ tokensDisbursal }) => (
  <Row className="mb-4">
    <Col md={5} lg={4} sm={12}>
      <SectionHeader layoutHasDecorator={false} className="mb-4">
        <FormattedMessage id="portfolio.section.asset-portfolio.title" />
      </SectionHeader>

      <Panel>
        <p>
          <FormattedMessage
            id="portfolio.asset.amounts-to-claim"
            values={{
              amounts: (
                <>
                  {tokensDisbursal
                    .map(t => (
                      <Money
                        key={t.currency}
                        value={t.amountToBeClaimed}
                        currency={t.currency}
                        theme={ETheme.GREEN_BIG}
                      />
                    ))
                    // add + between nodes
                    .reduce<React.ReactNode[]>(
                      (p, c) => (p.length === 0 ? p.concat(c) : p.concat(" + ", c)),
                      [],
                    )}
                </>
              ),
            }}
          />
        </p>
        <p className="mb-0">
          <FormattedMessage id="portfolio.asset.amounts-to-claim-description" />
        </p>
      </Panel>
    </Col>
    <Col md={7} lg={8} sm={12} className="mt-4 mt-md-0">
      <SectionHeader layoutHasDecorator={false} className="mb-4">
        <FormattedMessage id="portfolio.asset.payouts-from-neu.title" />
      </SectionHeader>

      <NewTable
        keepRhythm={true}
        titles={[
          "", // token icon
          "", // token name
          <FormattedMessage id="portfolio.asset.payouts-from-neu.your-share" />,
          <FormattedMessage id="portfolio.asset.payouts-from-neu.total-payout" />,
          <FormattedMessage id="portfolio.asset.payouts-from-neu.claim-by" />,
          "", // reject payout
          "", // accept payout
        ]}
      >
        {tokensDisbursal.map(
          ({ amountToBeClaimed, currency, totalDisbursedAmount, timeToFirstDisbursalRecycle }) => (
            <NewTableRow key={currency}>
              <CurrencyIcon currency={currency} />
              <>{selectCurrencyCode(currency)}</>
              <Money value={amountToBeClaimed} currency={currency} theme={ETheme.GREEN} />
              <Money value={totalDisbursedAmount} currency={currency} />
              <FormattedDate value={timeToFirstDisbursalRecycle} />
              <></>
              <></>
            </NewTableRow>
          ),
        )}
      </NewTable>
    </Col>
  </Row>
);

const AssetPortfolio = compose<ILayoutProps, IExternalProps>(
  branch<IExternalProps>(
    ({ tokensDisbursal }) => tokensDisbursal === undefined,
    renderComponent(LoadingIndicator),
  ),
  branch<ILayoutProps>(
    ({ tokensDisbursal }) => tokensDisbursal.every(d => isZero(d.amountToBeClaimed)),
    renderComponent(AssetPortfolioLayoutNoPayouts),
  ),
)(AssetPortfolioLayout);

export { AssetPortfolio };
