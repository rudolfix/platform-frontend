import { convertToUlps } from "@neufund/shared";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TETOWithTokenData } from "../../../modules/investor-portfolio/types";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import {
  PortfolioStatsErrorLayout,
  PortfolioStatsLayout,
  PortfolioStatsLayoutContainer,
  PortfolioStatsNoAssetsLayout,
  PortfolioStatsNoKYCLayout,
} from "./PortfolioStats";

import tokenIcon from "../../../assets/img/nEUR_icon.svg";

const myAssets = ([
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "Storybook",
    equityTokenSymbol: "STR",
    tokenData: {
      balance: "100",
      tokenPrice: convertToUlps("0.20"),
    },
  },
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "React",
    equityTokenSymbol: "RCT",
    tokenData: {
      balance: "28",
      tokenPrice: convertToUlps("3.14"),
    },
  },
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "Number 3",
    equityTokenSymbol: "NO3",
    tokenData: {
      balance: "120",
      tokenPrice: convertToUlps("4.20"),
    },
  },
] as unknown) as TETOWithTokenData[];

const moreAssets = ([
  ...myAssets,
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "Number 4",
    equityTokenSymbol: "NO4",
    tokenData: {
      balance: "123",
      tokenPrice: convertToUlps("27.31"),
    },
  },
] as unknown) as TETOWithTokenData[];

storiesOf("NDS|Molecules/Dashboard/PortfolioStats", module)
  .add("default", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={convertToUlps("100")}>
      <PortfolioStatsLayout
        isVerifiedInvestor={true}
        myAssetsEurEquivTotal={convertToUlps("1234")}
        myAssets={myAssets}
        goToPortfolio={action("GO_TO_PORTFOLIO")}
        goToProfile={action("GO_TO_PROFILE")}
      />
    </PortfolioStatsLayoutContainer>
  ))
  .add("more than 3", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={convertToUlps("100")}>
      <PortfolioStatsLayout
        isVerifiedInvestor={true}
        myAssetsEurEquivTotal={convertToUlps("1234")}
        myAssets={moreAssets}
        goToPortfolio={action("GO_TO_PORTFOLIO")}
        goToProfile={action("GO_TO_PROFILE")}
      />
    </PortfolioStatsLayoutContainer>
  ))
  .add("is not verified", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={undefined}>
      <PortfolioStatsNoKYCLayout goToProfile={action("GO_TO_PROFILE")} />
    </PortfolioStatsLayoutContainer>
  ))
  .add("no assets", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={undefined}>
      <PortfolioStatsNoAssetsLayout goToPortfolio={action("GO_TO_PORTFOLIO")} />
    </PortfolioStatsLayoutContainer>
  ))
  .add("has error", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={undefined}>
      <PortfolioStatsErrorLayout />
    </PortfolioStatsLayoutContainer>
  ))
  .add("loading", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={undefined}>
      <LoadingIndicator />
    </PortfolioStatsLayoutContainer>
  ));
