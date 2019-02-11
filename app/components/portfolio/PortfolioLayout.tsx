import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { ITokenDisbursal, TETOWithInvestorTicket } from "../../modules/investor-portfolio/types";
import { SectionHeader } from "../shared/SectionHeader";
import { ClaimedDividends } from "../wallet/claimed-dividends/ClaimedDividends";
import { AssetPortfolio } from "./AssetPortfolio";
import { PortfolioReservedAssets } from "./PortfolioReservedAssets";

import * as styles from "./PortfolioLayout.module.scss";
import { PortfolioMyAssets } from "./PortfolioMyAssets";

export type TPortfolioLayoutProps = {
  myAssets: TETOWithInvestorTicket[];
  walletAddress: string;
  pendingAssets: TETOWithInvestorTicket[];
  isRetailEto: boolean;
  tokensDisbursal: ReadonlyArray<ITokenDisbursal> | undefined;
};

const transactions: any[] = []; // TODO: Connect source of data

const PortfolioLayout: React.FunctionComponent<TPortfolioLayoutProps> = ({
  pendingAssets,
  walletAddress,
  isRetailEto,
  tokensDisbursal,
}) => (
  <section className={styles.portfolio}>
    {process.env.NF_ASSETS_PORTFOLIO_COMPONENT_VISIBLE === "1" && (
      <AssetPortfolio tokensDisbursal={tokensDisbursal} />
    )}

    <SectionHeader decorator={false} className="mb-4">
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
