import {
  ITokenDisbursal,
  TEtoWithCompanyAndContractReadonly,
  TETOWithInvestorTicket,
} from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Container } from "../layouts/Container";
import { WidgetGrid } from "../layouts/WidgetGrid";
import { Heading } from "../shared/Heading";
import { AssetPortfolio } from "./AssetPortfolio";
import { PortfolioMyAssets } from "./PortfolioMyAssets";
import { PortfolioPastInvestments } from "./PortfolioPastInvestments";
import { PortfolioReservedAssets } from "./PortfolioReservedAssets";

import * as styles from "./PortfolioLayout.module.scss";

export type TPortfolioLayoutProps = {
  myAssets: TEtoWithCompanyAndContractReadonly[];
  walletAddress: string;
  pendingAssets: TETOWithInvestorTicket[];
  isRetailEto: boolean;
  tokensDisbursal: ReadonlyArray<ITokenDisbursal> | undefined;
  isVerifiedInvestor: boolean;
  pastInvestments: TETOWithInvestorTicket[];
  tokenDisbursalIsLoading: boolean;
  tokenDisbursalError: boolean;
  tokensDisbursalEurEquivTotal: string;
  tokensDisbursalEurEquivTotalDisbursed: string;
  etosError: boolean;
};

export type IPortfolioDispatchProps = {
  loadTokensData: () => void;
};

const PortfolioLayout: React.FunctionComponent<TPortfolioLayoutProps> = ({
  pendingAssets,
  walletAddress,
  isRetailEto,
  tokensDisbursal,
  isVerifiedInvestor,
  pastInvestments,
  tokenDisbursalIsLoading,
  tokenDisbursalError,
  tokensDisbursalEurEquivTotal,
  tokensDisbursalEurEquivTotalDisbursed,
  etosError,
}) => (
  <WidgetGrid data-test-id="portfolio-layout" className={styles.wrapper}>
    <Container>
      <Heading level={2} decorator={false}>
        <FormattedMessage id="portfolio.title" />
      </Heading>
    </Container>
    {(process.env.NF_ASSETS_PORTFOLIO_COMPONENT_VISIBLE === "1" ||
      process.env.STORYBOOK_RUN === "1") && (
      <AssetPortfolio
        tokensDisbursal={tokensDisbursal}
        isVerifiedInvestor={isVerifiedInvestor}
        tokenDisbursalIsLoading={tokenDisbursalIsLoading}
        tokenDisbursalError={tokenDisbursalError}
        tokensDisbursalEurEquivTotal={tokensDisbursalEurEquivTotal}
        tokensDisbursalEurEquivTotalDisbursed={tokensDisbursalEurEquivTotalDisbursed}
      />
    )}

    <PortfolioReservedAssets pendingAssets={pendingAssets} hasError={etosError} />
    <PortfolioMyAssets isRetailEto={isRetailEto} walletAddress={walletAddress} />
    <PortfolioPastInvestments
      isRetailEto={isRetailEto}
      pastInvestments={pastInvestments}
      hasError={etosError}
    />
  </WidgetGrid>
);

export { PortfolioLayout };
