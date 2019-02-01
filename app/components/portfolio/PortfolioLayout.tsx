import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { TETOWithInvestorTicket } from "../../modules/investor-tickets/types";
import { AssetPortfolio } from "../shared/AssetPortfolio";
import { ECurrency } from "../shared/Money";
import { SectionHeader } from "../shared/SectionHeader";
import { ClaimedDividends } from "../wallet/claimed-dividends/ClaimedDividends";
import { PortfolioReservedAssets } from "./PortfolioReservedAssets";

import * as neuIcon from "../../assets/img/neu_icon.svg";
import * as styles from "./PortfolioLayout.module.scss";
import { PortfolioMyAssets } from "./PortfolioMyAssets";

export type TPortfolioLayoutProps = {
  myAssets: TETOWithInvestorTicket[];
  walletAddress: string;
  pendingAssets: TETOWithInvestorTicket[];
  isRetailEto: boolean;
};

const transactions: any[] = []; // TODO: Connect source of data

const PortfolioLayout: React.FunctionComponent<TPortfolioLayoutProps> = ({
  pendingAssets,
  isRetailEto,
  walletAddress,
}) => (
  <section className={styles.portfolio}>
    {process.env.NF_ASSETS_PORTFOLIO_COMPONENT_VISIBLE === "1" && (
      <>
        <SectionHeader layoutHasDecorator={false} className="mb-4">
          <FormattedMessage id="portfolio.section.asset-portfolio.title" />
        </SectionHeader>

        <Row>
          <Col className="mb-4">
            <AssetPortfolio
              icon={neuIcon}
              currency={ECurrency.NEU}
              currencyTotal={ECurrency.EUR}
              largeNumber="1000000000000"
              value="10000000000000"
              theme="light"
              size="large"
              moneyValue="100000000"
              moneyChange={-20}
              tokenValue="1000000"
              tokenChange={20}
            />
          </Col>
        </Row>
      </>
    )}

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.my-proceeds.title" />
    </SectionHeader>

    <Row>
      <Col className="mb-4">
        <ClaimedDividends className="h-100" totalEurValue="0" recentPayouts={transactions} />
      </Col>
    </Row>

    <PortfolioReservedAssets pendingAssets={pendingAssets} />
    <PortfolioMyAssets isRetailEto={isRetailEto} walletAddress={walletAddress} />
  </section>
);

export { PortfolioLayout };
